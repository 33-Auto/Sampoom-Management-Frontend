// @ts-nocheck
import { useEffect, useState } from "react";

import { useNotification } from "@/app/providers/NotificationContext";
import {
  usePartCategoryOptions,
  usePartGroupOptions,
  usePartSelectOptions,
} from "@/entities/part";
import { Button, InfoBox, Input, Select } from "@/shared/ui";

import {
  useCreateRopProcessMutation,
  useDeleteRopProcessMutation,
  useUpdateRopProcessMutation,
} from "../api/rop-process.api";
import type { RopProcessFormProps } from "../model/rop-process.types";

const WAREHOUSE_ID = 40; // 기본 창고 ID

export function RopProcessForm({
  ropId,
  ropData,
  onSuccess,
  onCancel,
}: RopProcessFormProps) {
  const isEditMode = !!ropId;
  const { showSuccess, showError, showConfirm } = useNotification();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");

  const [formData, setFormData] = useState({
    leadTime: 7,
    averageDaily: 10,
    maxStock: 200,
    autoOrderStatus: "ACTIVE" as "ACTIVE" | "INACTIVE",
    autoCalStatus: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  // ropData가 있으면 폼 초기값 설정
  useEffect(() => {
    if (ropData) {
      setSelectedCategoryId(ropData.categoryName || "");
      setSelectedGroupId(ropData.groupName || "");
      setSelectedPart("[" + ropData.partCode + "] " + ropData.partName || "");
      setSelectedPartId(
        ropData.partId !== undefined && ropData.partId !== null
          ? String(ropData.partId)
          : "",
      );
      setFormData({
        leadTime: ropData.leadTime || 7,
        averageDaily:
          ropData.rop && ropData.leadTime
            ? Math.round(ropData.rop / ropData.leadTime)
            : 0,
        maxStock: ropData.maxStock || 0,
        autoOrderStatus:
          (ropData.autoOrderStatus as "ACTIVE" | "INACTIVE") || "ACTIVE",
        autoCalStatus: "ACTIVE",
      });
    }
  }, [ropData]);

  const categoryOptions = usePartCategoryOptions();
  const groupOptions = usePartGroupOptions(
    selectedCategoryId ? Number(selectedCategoryId) : 0,
  );
  const partOptions = usePartSelectOptions(
    Number(selectedCategoryId),
    Number(selectedGroupId),
  );

  const createMutation = useCreateRopProcessMutation();
  const updateMutation = useUpdateRopProcessMutation();
  const deleteMutation = useDeleteRopProcessMutation();

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedGroupId("");
    setSelectedPart("");
    setSelectedPartId("");
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroupId(value);
    setSelectedPart("");
    setSelectedPartId("");
  };

  const handlePartChange = (value: string) => {
    setSelectedPartId(value);
    const selectedOption = partOptions.find((opt) => opt.value === value);
    setSelectedPart(selectedOption?.label ?? "");
  };

  // selectedPart에서 partCode 추출하는 헬퍼 함수
  const extractPartCode = (selectedPart: string): string => {
    if (!selectedPart) return "";
    // [code] name 형식에서 code 추출
    const match = selectedPart.match(/^\[(.+?)\]/);
    return match ? match[1] : "";
  };

  const handleAutoOrderChange = (checked: boolean) => {
    setFormData({
      ...formData,
      autoOrderStatus: checked ? "ACTIVE" : "INACTIVE",
      autoCalStatus: checked ? "ACTIVE" : "INACTIVE",
      ...(checked && {
        leadTime: 7,
        averageDaily: 10,
        maxStock: 200,
      }),
    });
  };

  const handleSubmit = () => {
    // 수정 모드에서는 ropData의 partCode 사용, 생성 모드에서는 selectedPart에서 추출
    const partCode = isEditMode
      ? ropData?.partCode
      : extractPartCode(selectedPart);

    if (!partCode) {
      showError("품목 선택 필요", "품목을 선택해주세요.");
      return;
    }

    if (isEditMode) {
      // 수정 모드

      updateMutation.mutate(
        {
          body: {
            ropId: ropId,
            autoCalStatus: formData.autoCalStatus,
            autoOrderStatus: formData.autoOrderStatus,
            leadTime: formData.leadTime,
            averageDaily: formData.averageDaily,
            maxStock: formData.maxStock,
          },
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "ROP 설정이 성공적으로 수정되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("수정 실패", "ROP 설정 수정에 실패했습니다.");
          },
        },
      );
    } else {
      // 생성 모드
      createMutation.mutate(
        {
          body: {
            warehouseId: WAREHOUSE_ID,
            partCode: partCode,
            autoCalStatus: formData.autoCalStatus,
            autoOrderStatus: formData.autoOrderStatus,
            leadTime: formData.leadTime,
            averageDaily: formData.averageDaily,
            maxStock: formData.maxStock,
          },
        },
        {
          onSuccess: () => {
            showSuccess("생성 완료", "ROP 설정이 성공적으로 생성되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("생성 실패", "ROP 설정 생성에 실패했습니다.");
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!ropId) return;

    showConfirm({
      title: "ROP 설정 삭제",
      message: `"${ropData?.partName || ropData?.partCode}" ROP 설정을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
      onConfirm: () => {
        deleteMutation.mutate(
          {
            params: {
              path: {
                ropId: ropId,
              },
            },
          },
          {
            onSuccess: () => {
              showSuccess("삭제 완료", "ROP 설정이 성공적으로 삭제되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("삭제 실패", "ROP 설정 삭제에 실패했습니다.");
            },
          },
        );
      },
    });
  };

  const calculatedRop = formData.averageDaily * formData.leadTime;

  const isAutoOrder = formData.autoOrderStatus === "ACTIVE";

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
      <div className="space-y-8 p-6">
        {/* 품목 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            품목 정보
          </h3>

          <div className="mb-4 grid grid-cols-1 gap-6 md:grid-cols-3">
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
                  value={selectedPartId}
                  onChange={(e) => handlePartChange(e.target.value)}
                  options={partOptions}
                  disabled={!selectedGroupId || isEditMode}
                />
              </>
            ) : (
              <>
                <Select
                  label="카테고리"
                  value={ropData?.categoryName || ""}
                  options={
                    ropData?.categoryName
                      ? [
                          {
                            value: ropData.categoryName,
                            label: ropData.categoryName,
                          },
                        ]
                      : []
                  }
                  disabled
                />
                <Select
                  label="그룹"
                  value={ropData?.groupName || ""}
                  options={
                    ropData?.groupName
                      ? [{ value: ropData.groupName, label: ropData.groupName }]
                      : []
                  }
                  disabled
                />
                <Select
                  label="품목"
                  value={
                    ropData?.partCode && ropData?.partName
                      ? `[${ropData.partCode}] ${ropData.partName}`
                      : ""
                  }
                  options={
                    ropData?.partCode && ropData?.partName
                      ? [
                          {
                            value: `[${ropData.partCode}] ${ropData.partName}`,
                            label: `[${ropData.partCode}] ${ropData.partName}`,
                          },
                        ]
                      : []
                  }
                  disabled
                />
              </>
            )}

            {/* <Input label="품목코드" value={selectedPartCode} disabled /> */}
          </div>

          {(selectedPart || ropData?.partCode) && (
            <div className="mt-4">
              <InfoBox type="info" title="선택된 품목">
                <p className="text-sm">
                  <strong>품목:</strong>{" "}
                  {selectedPart ||
                    `[${ropData?.partCode}] ${ropData?.partName}`}
                </p>
              </InfoBox>
            </div>
          )}
        </div>

        {/* 자동 발주 설정 */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            자동 발주 설정
          </h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAutoOrder}
                onChange={(e) => handleAutoOrderChange(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                자동 발주 활성화
              </span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              자동 발주를 활성화하면 시스템이 과거 데이터를 기반으로 ROP 값을
              자동 계산합니다.
            </p>
          </div>
        </div>

        {/* ROP 설정 */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            ROP 설정
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Input
                label="리드 타임 (일)"
                type="number"
                value={formData.leadTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    leadTime: Number(e.target.value),
                  })
                }
                min="1"
                disabled={isAutoOrder}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                발주부터 입고까지 소요 기간
              </p>
            </div>
            <div>
              <Input
                label="평균 일일 소비량"
                type="number"
                value={formData.averageDaily}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    averageDaily: Number(e.target.value),
                  })
                }
                min="0"
                step="0.1"
                disabled={isAutoOrder}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                하루 평균 사용량
              </p>
            </div>
            <div>
              <Input
                label="최대 재고"
                type="number"
                value={formData.maxStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxStock: Number(e.target.value),
                  })
                }
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                발주 시 최대 보유 수량
              </p>
            </div>
          </div>

          {isAutoOrder && (
            <InfoBox type="warning" title="자동 계산 모드" className="mt-6">
              <p className="text-sm">
                자동 발주가 활성화되어 시스템이 과거 발주/입고 이력과 출고
                이력을 분석하여 리드타임과 평균 소비량을 자동으로 계산합니다.
              </p>
            </InfoBox>
          )}

          {/* ROP 계산 미리보기 */}
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
            <h5 className="mb-2 font-semibold text-purple-900 dark:text-purple-200">
              ROP 계산 미리보기
            </h5>
            <div className="text-sm text-purple-800 dark:text-purple-300">
              <p>ROP = 평균 일일 소비량 × 리드 타임</p>
              <p>
                ROP = {formData.averageDaily} × {formData.leadTime} ={" "}
                <strong>{calculatedRop}</strong>
              </p>
              {formData.maxStock > 0 && (
                <p className="mt-2 text-purple-700 dark:text-purple-400">
                  재고가 <strong>{calculatedRop}</strong>에 도달하면{" "}
                  <strong>{formData.maxStock}</strong>까지 발주됩니다.
                </p>
              )}
            </div>
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
