import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useNotification } from "@/app/providers/NotificationContext";
import {
  useCategoryOptions,
  useGroupOptions,
  usePartOptions,
} from "@/entities/item";
import type { ProcessStepCreateRequestDTO } from "@/pages/master/routings/model";
import { useWorkCentersQuery } from "@/pages/master/workcenters/api";
import { Button, Input, Select } from "@/shared/ui";

import {
  useCreateRoutingMutation,
  useDeleteRoutingMutation,
  useUpdateRoutingMutation,
} from "../api/routing-process.api";
import { RoutingProcessSchema } from "../model/routing-process.contract";
import type {
  RoutingProcessFormData,
  RoutingProcessFormProps,
} from "../model/routing-process.types";

export function RoutingProcessForm({
  routingId,
  routingData,
  onSuccess,
  onCancel,
}: RoutingProcessFormProps) {
  const isEditMode = !!routingId;
  const { showSuccess, showError, showConfirm } = useNotification();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // react-hook-form 사용
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(RoutingProcessSchema),
    defaultValues: {
      partId: 0,
      version: "1.0",
      status: "ACTIVE" as const,
      quantity: 1,
      steps: [
        {
          stepOrder: 1,
          stepName: "",
          workCenterId: 0,
          setupMinutes: 0,
          processMinutes: 0,
          waitMinutes: 0,
        },
      ],
    },
  });

  // steps 배열 관리
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  // routingData가 있으면 폼 초기값 설정
  useEffect(() => {
    if (routingData) {
      reset({
        partId: routingData.partId || 0,
        version: routingData.version
          ? routingData.version.replace(/^v/i, "") || "1.0"
          : "1.0",
        status: routingData.status || "ACTIVE",
        quantity: routingData.quantity || 1,
        steps:
          routingData.steps && routingData.steps.length > 0
            ? routingData.steps.map((step) => ({
                stepOrder: step.stepOrder || 0,
                stepName: step.stepName || "",
                workCenterId: step.workCenterId || 0,
                setupMinutes: step.setupMinutes || 0,
                processMinutes: step.processMinutes || 0,
                waitMinutes: step.waitMinutes || 0,
              }))
            : [
                {
                  stepOrder: 1,
                  stepName: "",
                  workCenterId: 0,
                  setupMinutes: 0,
                  processMinutes: 0,
                  waitMinutes: 0,
                },
              ],
      });
    }
  }, [routingData, reset]);

  const createMutation = useCreateRoutingMutation();
  const updateMutation = useUpdateRoutingMutation();
  const deleteMutation = useDeleteRoutingMutation();

  const categoryOptions = useCategoryOptions();
  const groupOptions = useGroupOptions(
    selectedCategoryId ? Number(selectedCategoryId) : 0,
  );
  const partOptions = usePartOptions(
    Number(selectedCategoryId),
    Number(selectedGroupId),
  );

  // WorkCenters 옵션 가져오기
  const { data: workCentersData } = useWorkCentersQuery({});
  const workCenterOptions =
    workCentersData?.data?.content?.map((wc) => ({
      value: wc.id?.toString() || "",
      label: `${wc.code || ""} - ${wc.name || ""}`,
    })) || [];

  const statusOptions = [
    { value: "ACTIVE", label: "활성" },
    { value: "INACTIVE", label: "비활성" },
  ];

  // steps 값 감시
  const watchedSteps = watch("steps");

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedGroupId("");
    setValue("partId", 0);
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroupId(value);
    setValue("partId", 0);
  };

  const handlePartChange = (value: string) => {
    setValue("partId", Number(value), { shouldValidate: true });
  };

  const addStep = () => {
    append({
      stepOrder: fields.length + 1,
      stepName: "",
      workCenterId: 0,
      setupMinutes: 0,
      processMinutes: 0,
      waitMinutes: 0,
    });
  };

  const removeStep = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // 순서 재정렬
      const currentSteps = watch("steps");
      currentSteps.forEach((_, i) => {
        setValue(`steps.${i}.stepOrder`, i + 1);
      });
    }
  };

  const calculateTotalTime = (step: {
    setupMinutes?: number | unknown;
    processMinutes?: number | unknown;
    waitMinutes?: number | unknown;
  }) => {
    const setup = Number(step.setupMinutes) || 0;
    const process = Number(step.processMinutes) || 0;
    const wait = Number(step.waitMinutes) || 0;
    return setup + process + wait;
  };

  const getTotalLeadTime = () => {
    return watchedSteps.reduce(
      (total, step) => total + calculateTotalTime(step),
      0,
    );
  };

  const onSubmit = (data: RoutingProcessFormData) => {
    const stepsData: ProcessStepCreateRequestDTO[] = data.steps.map(
      (step: RoutingProcessFormData["steps"][0], index: number) => ({
        stepOrder: step.stepOrder || index + 1,
        stepName: step.stepName,
        workCenterId: step.workCenterId,
        setupMinutes: step.setupMinutes,
        processMinutes: step.processMinutes,
        waitMinutes: step.waitMinutes,
      }),
    );

    if (isEditMode && routingId) {
      // 수정 모드
      updateMutation.mutate(
        {
          params: {
            path: {
              id: routingId,
            },
          },
          body: {
            partId: data.partId,
            version: `v${data.version}`,
            status: data.status,
            quantity: data.quantity,
            steps: stepsData,
          },
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "공정이 성공적으로 수정되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("수정 실패", "공정 수정에 실패했습니다.");
          },
        },
      );
    } else {
      // 생성 모드
      createMutation.mutate(
        {
          body: {
            partId: data.partId,
            version: `v${data.version}`,
            status: data.status,
            quantity: data.quantity,
            steps: stepsData,
          },
        },
        {
          onSuccess: () => {
            showSuccess("생성 완료", "공정이 성공적으로 생성되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("생성 실패", "공정 생성에 실패했습니다.");
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!routingId) return;

    showConfirm({
      title: "공정 삭제",
      message: `"${routingData?.code || routingData?.partName}" 공정을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
      onConfirm: () => {
        deleteMutation.mutate(
          {
            params: {
              path: {
                id: routingId,
              },
            },
          },
          {
            onSuccess: () => {
              showSuccess("삭제 완료", "공정이 성공적으로 삭제되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("삭제 실패", "공정 삭제에 실패했습니다.");
            },
          },
        );
      },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8 p-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              기본 정보
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {!isEditMode ? (
                <>
                  <Select
                    label="카테고리"
                    value={selectedCategoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    options={categoryOptions}
                    disabled={isEditMode}
                  />
                  <Select
                    label="그룹"
                    value={selectedGroupId}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    options={groupOptions}
                    disabled={!selectedCategoryId || isEditMode}
                  />
                  <Select
                    label="품목"
                    value={watch("partId")?.toString() || ""}
                    onChange={(e) => handlePartChange(e.target.value)}
                    options={partOptions}
                    disabled={!selectedGroupId || isEditMode}
                    errorText={errors.partId?.message}
                  />
                </>
              ) : (
                <>
                  <Select
                    label="품목"
                    value={
                      routingData?.partCode && routingData?.partName
                        ? `[${routingData.partCode}] ${routingData.partName}`
                        : ""
                    }
                    options={
                      routingData?.partCode && routingData?.partName
                        ? [
                            {
                              value: `[${routingData.partCode}] ${routingData.partName}`,
                              label: `[${routingData.partCode}] ${routingData.partName}`,
                            },
                          ]
                        : []
                    }
                    disabled
                  />
                </>
              )}
              <Input
                label="버전"
                type="number"
                placeholder="1.0"
                {...register("version")}
                step="0.1"
                min="1"
                helperText="공정의 버전을 입력하세요 (예: 1.0, 1.1, 2.0)"
                errorText={errors.version?.message}
              />
              <Select
                label="상태"
                options={statusOptions}
                value={watch("status")}
                onChange={(e) =>
                  setValue("status", e.target.value as "ACTIVE" | "INACTIVE", {
                    shouldValidate: true,
                  })
                }
                errorText={errors.status?.message}
              />
              <Input
                label="수량"
                type="number"
                placeholder="1"
                {...register("quantity", { valueAsNumber: true })}
                min="1"
                helperText="기준 수량을 입력하세요"
                errorText={errors.quantity?.message}
              />
            </div>
          </div>

          {/* 공정 순서 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                공정 순서
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  총 리드타임:{" "}
                  <span className="font-medium">{getTotalLeadTime()}분</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addStep}
                >
                  <i className="ri-add-line mr-2"></i>
                  공정 추가
                </Button>
              </div>
            </div>

            {errors.steps && (
              <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                {errors.steps.message}
              </p>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-main-500 text-sm font-medium text-white">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        공정 {index + 1}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => removeStep(index)}
                      >
                        <i className="ri-delete-bin-line text-red-500"></i>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Input
                      label="공정명"
                      placeholder="CNC 가공"
                      {...register(`steps.${index}.stepName`)}
                      errorText={errors.steps?.[index]?.stepName?.message}
                    />
                    <Select
                      label="작업장"
                      options={[
                        { value: "", label: "작업장 선택" },
                        ...workCenterOptions,
                      ]}
                      value={
                        watch(`steps.${index}.workCenterId`)?.toString() || ""
                      }
                      onChange={(e) =>
                        setValue(
                          `steps.${index}.workCenterId`,
                          Number(e.target.value),
                          { shouldValidate: true },
                        )
                      }
                      errorText={errors.steps?.[index]?.workCenterId?.message}
                    />
                    <Input
                      label="준비시간 (분)"
                      type="number"
                      placeholder="30"
                      {...register(`steps.${index}.setupMinutes`, {
                        valueAsNumber: true,
                      })}
                      min="0"
                      errorText={errors.steps?.[index]?.setupMinutes?.message}
                    />
                    <Input
                      label="가공시간 (분)"
                      type="number"
                      placeholder="120"
                      {...register(`steps.${index}.processMinutes`, {
                        valueAsNumber: true,
                      })}
                      min="0"
                      errorText={errors.steps?.[index]?.processMinutes?.message}
                    />
                    <Input
                      label="대기시간 (분)"
                      type="number"
                      placeholder="15"
                      {...register(`steps.${index}.waitMinutes`, {
                        valueAsNumber: true,
                      })}
                      min="0"
                      errorText={errors.steps?.[index]?.waitMinutes?.message}
                    />
                    <div className="w-full">
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        소계 (분)
                      </label>
                      <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                        {calculateTotalTime(watchedSteps[index])}
                      </div>
                      {/* 에러 메시지 공간 확보를 위한 빈 공간 */}
                      <div className="mt-1 min-h-[20px] text-sm"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 총 시간 요약 */}
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
            <h5 className="mb-2 font-semibold text-purple-900 dark:text-purple-200">
              총 리드타임 계산
            </h5>
            <div className="text-sm text-purple-800 dark:text-purple-300">
              <p>
                총 리드타임: <strong>{getTotalLeadTime()}분</strong>
              </p>
              <p className="mt-2 text-purple-700 dark:text-purple-400">
                준비시간 + 가공시간 + 대기시간의 합계입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-between border-t border-gray-200 p-6 dark:border-gray-700">
          <div>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                loading={deleteMutation.isPending}
              >
                <i className="ri-delete-bin-line mr-2"></i>
                삭제
              </Button>
            )}
          </div>
          <div className="flex space-x-4">
            <Button type="button" variant="secondary" onClick={onCancel}>
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!isValid}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              <i className="ri-save-line mr-2"></i>
              저장
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
