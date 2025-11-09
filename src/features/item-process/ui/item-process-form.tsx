import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type ReactNode } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useNotification } from "@/app/providers/NotificationContext";
import { useMaterialCategoryOptions } from "@/entities/material";
import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import { queryClient } from "@/shared/api/base";
import type { Schemas } from "@/shared/model";
import { Button, Input, Select } from "@/shared/ui";

import {
  useCreateMaterialMutation,
  useCreatePartMutation,
  useUpdateMaterialMutation,
  useUpdatePartMutation,
} from "../api/item-process.api";
import {
  ItemProcessSchema,
  type ItemProcessFormData,
  type ItemProcessFormProps,
  type ItemProcessType,
  type MaterialCreateRequestDTO,
  type MaterialDetailResponseDTO,
  type MaterialUpdateRequestDTO,
  type PartCreateRequestDTO,
  type PartUpdateRequestDTO,
} from "../model";

// PartDetailResponseDTO가 PartResponseDTO를 참조하지만 실제 API는 PartListResponseDTO를 반환
type PartDetailResponseDTO = Schemas["PartListResponseDTO"];

// 확장된 Props 타입 (UI 파일 내부에서 정의)
type ExtendedItemProcessFormProps = ItemProcessFormProps & {
  itemType?: ItemProcessType;
  itemData?: MaterialDetailResponseDTO | PartDetailResponseDTO;
  categoryId?: number;
  categoryName?: string;
  groupId?: number;
  groupName?: string;
};

const UNIT_OPTIONS = [
  { value: "", label: "단위 선택" },
  { value: "EA", label: "개" },
  { value: "KG", label: "킬로그램" },
  { value: "L", label: "리터" },
  { value: "M", label: "미터" },
  { value: "BOX", label: "박스" },
];

const ITEM_TYPE_OPTIONS: Array<{ value: ItemProcessType; label: string }> = [
  { value: "MATERIAL", label: "원자재 (MATERIAL)" },
  { value: "PART", label: "부품 (PART)" },
];

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const FormSection = ({ title, description, children }: FormSectionProps) => (
  <section className="space-y-4">
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {description ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      ) : null}
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>
  </section>
);

type InitParams = {
  type: ItemProcessType;
  itemData?: MaterialDetailResponseDTO | PartDetailResponseDTO | null;
  categoryId?: number;
  groupId?: number;
};

const ensureType = (value?: ItemProcessType): ItemProcessType =>
  value ?? "MATERIAL";

const buildInitialValues = ({
  type,
  itemData,
  categoryId,
  groupId,
}: InitParams): ItemProcessFormData => {
  if (type === "MATERIAL") {
    const material = itemData as MaterialDetailResponseDTO | undefined;
    return {
      type,
      name: material?.name ?? "",
      materialCategoryId: material?.materialCategoryId ?? categoryId,
      materialUnit: material?.materialUnit ?? "",
      partCategoryId: undefined,
      groupId: undefined,
      partUnit: "",
      baseQuantity: material?.baseQuantity ?? 0,
      standardQuantity: material?.standardQuantity ?? 0,
      leadTime: material?.leadTime ?? 0,
      standardCost: material?.standardCost ?? 0,
    };
  }

  const part = itemData as PartDetailResponseDTO | undefined;
  return {
    type,
    name: part?.name ?? "",
    materialCategoryId: undefined,
    materialUnit: "",
    partCategoryId: part?.categoryId ?? categoryId,
    groupId: part?.groupId ?? groupId,
    partUnit: part?.partUnit ?? "",
    baseQuantity: part?.baseQuantity ?? 0,
    standardQuantity: part?.standardQuantity ?? 0,
    leadTime: part?.leadTime ?? undefined,
    standardCost: undefined,
  };
};

export function ItemProcessForm({
  itemId,
  itemType,
  itemData: itemDataFromProps,
  categoryId,
  // categoryName,
  groupId,
  // groupName,
  onSuccess,
  onCancel,
}: ExtendedItemProcessFormProps) {
  const isEditMode = !!itemId;
  const { showSuccess, showError } = useNotification();

  const initialType = ensureType(itemType);

  // useQuery로 데이터 조회 (itemId와 itemType이 있고, props로 받은 itemData가 없을 때만)
  const shouldFetchMaterial = Boolean(
    isEditMode && itemId && initialType === "MATERIAL" && !itemDataFromProps,
  );
  const shouldFetchPart = Boolean(
    isEditMode && itemId && initialType === "PART" && !itemDataFromProps,
  );

  const {
    data: materialDetailResponse,
    // isLoading: loadingMaterial
  } = queryClient.useQuery(
    "get",
    "/api/part/materials/{materialId}",
    {
      params: {
        path: {
          materialId: itemId!,
        },
      },
    },
    {
      enabled: shouldFetchMaterial,
    },
  );

  const {
    data: partDetailResponse,
    // isLoading: loadingPart
  } = queryClient.useQuery(
    "get",
    "/api/part/parts/{partId}",
    {
      params: {
        path: {
          partId: itemId!,
        },
      },
    },
    {
      enabled: shouldFetchPart,
    },
  );

  // const isLoading = loadingMaterial || loadingPart;

  // 사용할 데이터 결정: props로 받은 데이터 우선, 없으면 useQuery로 조회한 데이터
  const itemData =
    itemDataFromProps ??
    (initialType === "MATERIAL"
      ? materialDetailResponse?.data
      : partDetailResponse?.data);

  const form = useForm<ItemProcessFormData>({
    mode: "onTouched",
    resolver: zodResolver(ItemProcessSchema) as any,
    defaultValues: buildInitialValues({
      type: initialType,
      itemData: itemData ?? null,
      categoryId,
      groupId,
    }),
  });

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const type = watch("type") ?? initialType;
  const materialCategoryId = watch("materialCategoryId");
  const partCategoryId = watch("partCategoryId");
  const selectedGroupId = watch("groupId");

  // 데이터가 변경되면 폼 리셋
  useEffect(() => {
    if (!isEditMode || !itemData) return;

    reset(
      buildInitialValues({
        type: ensureType(type),
        itemData,
        categoryId,
        groupId,
      }),
    );
  }, [reset, itemData, categoryId, groupId, isEditMode, type]);

  // 옵션 배열 (훅에서 이미 옵션 배열 형태로 반환)
  const materialCategoryOptions = useMaterialCategoryOptions();
  const partCategoryOptions = usePartCategoryOptions();
  const partGroupOptions = usePartGroupOptions(
    partCategoryId ? partCategoryId : 0,
  );

  const createMaterialMutation = useCreateMaterialMutation();
  const createPartMutation = useCreatePartMutation();
  const updateMaterialMutation = useUpdateMaterialMutation();
  const updatePartMutation = useUpdatePartMutation();

  const handleTypeChange = (next: ItemProcessType) => {
    setValue("type", next, { shouldValidate: true, shouldTouch: true });

    if (next === "MATERIAL") {
      const material = itemData as MaterialDetailResponseDTO | undefined;
      setValue(
        "materialCategoryId",
        material?.materialCategoryId ?? materialCategoryId ?? categoryId,
        {
          shouldValidate: true,
        },
      );
      setValue("materialUnit", material?.materialUnit ?? "", {
        shouldValidate: true,
      });
      setValue("leadTime", material?.leadTime ?? 0, { shouldValidate: true });
      setValue("standardCost", material?.standardCost ?? 0, {
        shouldValidate: true,
      });
      setValue("partCategoryId", undefined, { shouldValidate: false });
      setValue("groupId", undefined, { shouldValidate: false });
      setValue("partUnit", "", { shouldValidate: false });
    } else {
      const part = itemData as PartDetailResponseDTO | undefined;
      setValue("materialCategoryId", undefined, { shouldValidate: false });
      setValue("materialUnit", "", { shouldValidate: false });
      setValue("standardCost", undefined, { shouldValidate: false });
      setValue("leadTime", part?.leadTime ?? undefined, {
        shouldValidate: false,
      });
      setValue(
        "partCategoryId",
        part?.categoryId ?? partCategoryId ?? categoryId,
        {
          shouldValidate: true,
        },
      );
      setValue("groupId", part?.groupId ?? selectedGroupId ?? groupId, {
        shouldValidate: true,
      });
      setValue("partUnit", (part?.partUnit ?? watch("partUnit")) || "", {
        shouldValidate: true,
      });
    }
  };

  const onSubmit: SubmitHandler<ItemProcessFormData> = (data) => {
    if (data.type === "MATERIAL") {
      const basePayload: MaterialCreateRequestDTO = {
        name: data.name.trim(),
        materialCategoryId: data.materialCategoryId!,
        materialUnit: data.materialUnit!,
        baseQuantity: data.baseQuantity,
        standardQuantity: data.standardQuantity,
        leadTime: data.leadTime!,
        standardCost: data.standardCost!,
      };

      if (isEditMode && itemId) {
        const payload: MaterialUpdateRequestDTO = basePayload;

        updateMaterialMutation.mutate(
          {
            params: {
              path: {
                materialId: itemId,
              },
            },
            body: payload,
          },
          {
            onSuccess: () => {
              showSuccess("수정 완료", "자재가 성공적으로 수정되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("수정 실패", "자재 수정 중 오류가 발생했습니다.");
            },
          },
        );
      } else {
        createMaterialMutation.mutate(
          { body: basePayload },
          {
            onSuccess: () => {
              showSuccess("등록 완료", "자재가 성공적으로 등록되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("등록 실패", "자재 등록 중 오류가 발생했습니다.");
            },
          },
        );
      }

      return;
    }

    const basePayload: PartCreateRequestDTO = {
      name: data.name.trim(),
      groupId: data.groupId!,
      partUnit: data.partUnit!,
      baseQuantity: data.baseQuantity,
      standardQuantity: data.standardQuantity,
    };

    const updatePayload: PartUpdateRequestDTO = {
      ...basePayload,
      status: "ACTIVE",
    };

    if (isEditMode && itemId) {
      updatePartMutation.mutate(
        {
          params: {
            path: {
              partId: itemId,
            },
          },
          body: updatePayload,
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "부품이 성공적으로 수정되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("수정 실패", "부품 수정 중 오류가 발생했습니다.");
          },
        },
      );
    } else {
      createPartMutation.mutate(
        { body: basePayload },
        {
          onSuccess: () => {
            showSuccess("등록 완료", "부품이 성공적으로 등록되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("등록 실패", "부품 등록 중 오류가 발생했습니다.");
          },
        },
      );
    }
  };

  const renderCategorySelect = () => {
    if (type === "MATERIAL") {
      return (
        <Select
          label="자재 카테고리"
          value={materialCategoryId ? materialCategoryId.toString() : ""}
          options={materialCategoryOptions}
          onChange={(e) =>
            setValue(
              "materialCategoryId",
              e.target.value ? Number(e.target.value) : undefined,
              { shouldValidate: true, shouldTouch: true },
            )
          }
          errorText={errors.materialCategoryId?.message}
        />
      );
    }

    return (
      <Select
        label="부품 카테고리"
        value={partCategoryId ? partCategoryId.toString() : ""}
        options={partCategoryOptions}
        onChange={(e) => {
          const nextValue = e.target.value ? Number(e.target.value) : undefined;
          setValue("partCategoryId", nextValue, {
            shouldValidate: true,
            shouldTouch: true,
          });
          setValue("groupId", undefined, { shouldValidate: true });
        }}
        errorText={errors.partCategoryId?.message}
      />
    );
  };

  const renderGroupSelect = () => {
    if (type !== "PART") return null;
    return (
      <Select
        label="부품 그룹"
        value={selectedGroupId ? selectedGroupId.toString() : ""}
        options={partGroupOptions}
        onChange={(e) =>
          setValue(
            "groupId",
            e.target.value ? Number(e.target.value) : undefined,
            { shouldValidate: true, shouldTouch: true },
          )
        }
        errorText={errors.groupId?.message}
        disabled={!partCategoryId}
      />
    );
  };

  const renderUnitSelect = () => {
    if (type === "MATERIAL") {
      return (
        <Select
          label="기본 단위"
          value={watch("materialUnit") || ""}
          options={UNIT_OPTIONS}
          onChange={(e) =>
            setValue("materialUnit", e.target.value, {
              shouldValidate: true,
              shouldTouch: true,
            })
          }
          errorText={errors.materialUnit?.message}
        />
      );
    }

    return (
      <Select
        label="기본 단위"
        value={watch("partUnit") || ""}
        options={UNIT_OPTIONS}
        onChange={(e) =>
          setValue("partUnit", e.target.value, {
            shouldValidate: true,
            shouldTouch: true,
          })
        }
        errorText={errors.partUnit?.message}
      />
    );
  };

  // // 로딩 중일 때 표시
  // if (isLoading) {
  //   return (
  //     <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
  //       <div className="flex h-64 items-center justify-center">
  //         <div className="text-center text-gray-600 dark:text-gray-300">
  //           <i className="ri-loader-4-line mb-4 animate-spin text-4xl" />
  //           <p>품목 정보를 불러오는 중입니다...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // 수정 모드인데 데이터가 없을 때
  if (isEditMode && !itemData) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">품목 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
      <form
        onSubmit={handleSubmit(onSubmit as SubmitHandler<ItemProcessFormData>)}
      >
        <div className="space-y-10 p-6">
          <FormSection
            title="품목 기본 정보"
            description="품목의 기본 속성을 입력하세요."
          >
            <Input
              label="품목명"
              placeholder="예) 스테인리스 볼트"
              {...register("name")}
              errorText={errors.name?.message}
            />
            <Select
              label="품목 유형"
              value={type}
              options={ITEM_TYPE_OPTIONS}
              onChange={(e) =>
                handleTypeChange(e.target.value as ItemProcessType)
              }
              disabled={isEditMode}
            />
            {renderUnitSelect()}
          </FormSection>

          <FormSection
            title="분류 및 그룹 설정"
            description="카테고리와 그룹을 지정하여 품목을 체계적으로 관리합니다."
          >
            {renderCategorySelect()}
            {renderGroupSelect()}
          </FormSection>

          <FormSection
            title="재고 · 운영 지표"
            description="안전 재고와 기준 수량, 리드 타임 등의 값을 입력하세요."
          >
            <Input
              label="안전 재고 (baseQuantity)"
              type="number"
              placeholder="0"
              {...register("baseQuantity", { valueAsNumber: true })}
              errorText={errors.baseQuantity?.message}
            />
            <Input
              label="기준 수량 (standardQuantity)"
              type="number"
              placeholder="0"
              {...register("standardQuantity", { valueAsNumber: true })}
              errorText={errors.standardQuantity?.message}
            />
            {type === "MATERIAL" ? (
              <>
                <Input
                  label="리드 타임 (일)"
                  type="number"
                  placeholder="0"
                  {...register("leadTime", {
                    valueAsNumber: true,
                  })}
                  errorText={errors.leadTime?.message}
                />
                <Input
                  label="표준 단가 (standardCost)"
                  type="number"
                  placeholder="0"
                  {...register("standardCost", {
                    valueAsNumber: true,
                  })}
                  errorText={errors.standardCost?.message}
                />
              </>
            ) : (
              <Input
                label="리드 타임 (선택)"
                type="number"
                placeholder="0"
                {...register("leadTime", {
                  setValueAs: (value) =>
                    value === "" || value === undefined
                      ? undefined
                      : Number(value),
                })}
                errorText={errors.leadTime?.message}
              />
            )}
          </FormSection>
        </div>

        <div className="flex justify-between border-t border-gray-200 p-6 dark:border-gray-700">
          <div className="flex space-x-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit" variant="default">
              <i className="ri-save-line mr-2"></i>
              저장
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
