import { useEffect, useState } from "react";

import { useNotification } from "@/shared/lib";
import { Button, Input, Select } from "@/shared/ui";

import {
  useCreateWorkCenterMutation,
  useDeleteWorkCenterMutation,
  useUpdateWorkCenterMutation,
} from "../api/workcenter-process.api";
import type { WorkCenterProcessFormProps } from "../model/workcenter-process.types";

export function WorkCenterProcessForm({
  workCenterId,
  workCenterData,
  onSuccess,
  onCancel,
}: WorkCenterProcessFormProps) {
  const isEditMode = !!workCenterId;
  const { showSuccess, showError, showConfirm } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    type: "INTERNAL" as "INTERNAL" | "EXTERNAL",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "MAINTENANCE",
    dailyOperatingHours: 8,
    efficiency: 85,
    costPerHour: 0,
  });

  // workCenterData가 있으면 폼 초기값 설정
  useEffect(() => {
    if (workCenterData) {
      setFormData({
        name: workCenterData.name || "",
        type: workCenterData.type || "INTERNAL",
        status: workCenterData.status || "ACTIVE",
        dailyOperatingHours: workCenterData.dailyOperatingHours || 8,
        efficiency: workCenterData.efficiency || 85,
        costPerHour: workCenterData.costPerHour || 0,
      });
    }
  }, [workCenterData]);

  const createMutation = useCreateWorkCenterMutation();
  const updateMutation = useUpdateWorkCenterMutation();
  const deleteMutation = useDeleteWorkCenterMutation();

  const typeOptions = [
    { value: "INTERNAL", label: "내부 설비" },
    { value: "EXTERNAL", label: "외주 가공처" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "가동" },
    { value: "INACTIVE", label: "중단" },
    { value: "MAINTENANCE", label: "정비" },
  ];

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      showError("입력 오류", "작업장명을 입력해주세요.");
      return;
    }

    if (formData.dailyOperatingHours <= 0) {
      showError("입력 오류", "일일 가동시간을 올바르게 입력해주세요.");
      return;
    }

    if (formData.efficiency <= 0 || formData.efficiency > 100) {
      showError("입력 오류", "효율성을 1-100 사이의 값으로 입력해주세요.");
      return;
    }

    if (formData.costPerHour <= 0) {
      showError("입력 오류", "시간당 비용을 올바르게 입력해주세요.");
      return;
    }

    if (isEditMode) {
      // 수정 모드
      updateMutation.mutate(
        {
          params: {
            path: {
              id: workCenterId!,
            },
          },
          body: {
            name: formData.name,
            type: formData.type,
            status: formData.status as "ACTIVE" | "INACTIVE",
            dailyOperatingHours: formData.dailyOperatingHours,
            efficiency: formData.efficiency,
            costPerHour: formData.costPerHour,
          },
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "작업장이 성공적으로 수정되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("수정 실패", "작업장 수정에 실패했습니다.");
          },
        },
      );
    } else {
      // 생성 모드
      createMutation.mutate(
        {
          body: {
            name: formData.name,
            type: formData.type,
            status: formData.status as "ACTIVE" | "INACTIVE",
            dailyOperatingHours: formData.dailyOperatingHours,
            efficiency: formData.efficiency,
            costPerHour: formData.costPerHour,
          },
        },
        {
          onSuccess: () => {
            showSuccess("생성 완료", "작업장이 성공적으로 생성되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("생성 실패", "작업장 생성에 실패했습니다.");
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!workCenterId) return;

    showConfirm({
      title: "작업장 삭제",
      message: `"${workCenterData?.name || workCenterData?.code}" 작업장을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
      onConfirm: () => {
        deleteMutation.mutate(
          {
            params: {
              path: {
                id: workCenterId,
              },
            },
          },
          {
            onSuccess: () => {
              showSuccess("삭제 완료", "작업장이 성공적으로 삭제되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("삭제 실패", "작업장 삭제에 실패했습니다.");
            },
          },
        );
      },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
      <div className="space-y-8 p-6">
        {/* 기본 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            기본 정보
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="작업장명"
                placeholder="절삭 가공 1호기"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                helperText="작업장의 이름을 입력하세요"
              />
            </div>
            <Select
              label="작업장 유형"
              options={typeOptions}
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "INTERNAL" | "EXTERNAL",
                })
              }
            />
            <Select
              label="작업장 상태"
              options={statusOptions}
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as
                    | "ACTIVE"
                    | "INACTIVE"
                    | "MAINTENANCE",
                })
              }
            />
          </div>
        </div>

        {/* 운영 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            운영 정보
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="일일 가동시간"
              type="number"
              placeholder="8"
              value={formData.dailyOperatingHours}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyOperatingHours: Number(e.target.value),
                })
              }
              min="1"
              helperText="시간 단위로 입력"
            />
            <Input
              label="효율성"
              type="number"
              placeholder="85"
              min="1"
              max="100"
              value={formData.efficiency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  efficiency: Number(e.target.value),
                })
              }
              helperText="% 단위로 입력 (1-100)"
            />
            <div className="md:col-span-2">
              <Input
                label="시간당 비용"
                type="number"
                placeholder="45000"
                value={formData.costPerHour}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    costPerHour: Number(e.target.value),
                  })
                }
                min="0"
                helperText="원 단위로 입력"
              />
            </div>
          </div>
        </div>

        {/* 작업장 능력 정보 */}
        <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
          <h5 className="mb-2 font-semibold text-purple-900 dark:text-purple-200">
            작업장 능력 계산
          </h5>
          <div className="text-sm text-purple-800 dark:text-purple-300">
            <p>
              가용 능력 = 일일 가동시간 × 효율(%) ={" "}
              <strong>
                {formData.dailyOperatingHours} × {formData.efficiency}% ={" "}
                {(
                  (formData.dailyOperatingHours * formData.efficiency) /
                  100
                ).toFixed(2)}
                시간
              </strong>
            </p>
            <p className="mt-2 text-purple-700 dark:text-purple-400">
              일일 실제 생산 가능 시간은{" "}
              <strong>
                {(
                  (formData.dailyOperatingHours * formData.efficiency) /
                  100
                ).toFixed(2)}
                시간
              </strong>
              입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between border-t border-gray-200 p-6 dark:border-gray-700">
        <div>
          {isEditMode && (
            <Button
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
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            <i className="ri-save-line mr-2"></i>
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
