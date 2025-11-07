import { useEffect, useState } from "react";

import { useNotification } from "@/app/providers/NotificationContext";
import {
  usePartCategoryOptions,
  usePartGroupOptions,
  usePartSelectOptions,
} from "@/entities/part";
import { usePartSearchQuery } from "@/entities/part/api/part.api";
import { useMaterialsQuery } from "@/pages/master/bom/api";
import type { MaterialResponseDTO } from "@/pages/master/bom/model";
import { Button, Card, Input, Modal, Select } from "@/shared/ui";

import {
  useCreateBomProcessMutation,
  useDeleteBomProcessMutation,
  useUpdateBomProcessMutation,
} from "../api/bom-process.api";
import type { BomProcessFormProps } from "../model/bom-process.types";

interface BomMaterial {
  materialId: number;
  materialName: string;
  materialCode: string;
  quantity: number;
  unit: string;
  standardCost: number;
}

export function BomProcessForm({
  bomId,
  bomData,
  categoryName,
  groupName,
  onSuccess,
  onCancel,
}: BomProcessFormProps) {
  const isEditMode = !!bomId;
  const { showSuccess, showError, showConfirm } = useNotification();

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedPartId, setSelectedPartId] = useState<number | undefined>(
    undefined,
  );

  const [bomStatus, setBomStatus] = useState<
    "ACTIVE" | "REVIEWING" | "INACTIVE" | "PENDING_APPROVAL"
  >("REVIEWING");
  const [bomMaterials, setBomMaterials] = useState<BomMaterial[]>([]);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialSearchTerm, setMaterialSearchTerm] = useState("");
  const [materialCategoryId, setMaterialCategoryId] = useState("");

  // bomData가 있으면 폼 초기값 설정
  useEffect(() => {
    if (bomData) {
      // 수정 모드에서 bomData의 품목 정보 설정
      // props로 받은 categoryName, groupName 우선 사용
      if (categoryName) {
        setSelectedCategoryId(categoryName);
      } else if ((bomData as any).partCategoryName) {
        setSelectedCategoryId((bomData as any).partCategoryName);
      }
      if (groupName) {
        setSelectedGroupId(groupName);
      } else if ((bomData as any).partGroupName) {
        setSelectedGroupId((bomData as any).partGroupName);
      }
      if (bomData.partCode && bomData.partName) {
        setSelectedPart(`[${bomData.partCode}] ${bomData.partName}`);
      }
      if (bomData.partId) {
        setSelectedPartId(bomData.partId);
      }
      if (bomData.status) {
        setBomStatus(
          bomData.status as
            | "ACTIVE"
            | "REVIEWING"
            | "INACTIVE"
            | "PENDING_APPROVAL",
        );
      }
      // materials 설정
      // BomDetailResponseDTO의 materials는 BomMaterialDTO 타입이지만,
      // 실제 API 응답에는 상세 정보가 포함될 수 있음
      if (bomData.materials && bomData.materials.length > 0) {
        const materials: BomMaterial[] = bomData.materials.map((m: any) => ({
          materialId: m.materialId || 0,
          materialName: m.materialName || "",
          materialCode: m.materialCode || "",
          quantity: m.quantity || 1,
          unit: m.unit || "",
          standardCost: m.standardCost || 0,
        }));
        setBomMaterials(materials);
      }
    }
  }, [bomData, categoryName, groupName]);

  const categoryOptions = usePartCategoryOptions();
  const groupOptions = usePartGroupOptions(
    selectedCategoryId ? Number(selectedCategoryId) : 0,
  );
  const partOptions = usePartSelectOptions(
    Number(selectedCategoryId),
    Number(selectedGroupId),
  );
  // partId를 찾기 위한 raw data
  const { data: partSearchData } = usePartSearchQuery(
    Number(selectedCategoryId),
    Number(selectedGroupId),
  );

  const { data: materialsData, isLoading: materialsLoading } =
    useMaterialsQuery({
      keyword: materialSearchTerm === "" ? undefined : materialSearchTerm,
      categoryId:
        materialCategoryId === "" ? undefined : Number(materialCategoryId),
      page: 0,
      size: 50,
    });

  const createMutation = useCreateBomProcessMutation();
  const updateMutation = useUpdateBomProcessMutation();
  const deleteMutation = useDeleteBomProcessMutation();

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedGroupId("");
    setSelectedPart("");
    setSelectedPartId(undefined);
  };

  const handleGroupChange = (value: string) => {
    setSelectedGroupId(value);
    setSelectedPart("");
    setSelectedPartId(undefined);
  };

  const handlePartChange = (value: string) => {
    const selectedOption = partOptions.find((opt) => opt.value === value);
    if (selectedOption) {
      setSelectedPart(selectedOption.label);
      // partCode로 partId 찾기
      const foundPart = partSearchData?.data?.content?.find(
        (p) => p.code === value,
      );
      if (foundPart?.id) {
        setSelectedPartId(foundPart.id);
      } else {
        setSelectedPartId(undefined);
      }
    } else {
      setSelectedPart("");
      setSelectedPartId(undefined);
    }
  };

  // selectedPart에서 partCode 추출하는 헬퍼 함수
  const extractPartCode = (selectedPart: string): string => {
    if (!selectedPart) return "";
    const match = selectedPart.match(/^\[(.+?)\]/);
    return match ? match[1] : "";
  };

  const statusOptions = [
    { value: "REVIEWING", label: "검토중" },
    { value: "PENDING_APPROVAL", label: "승인대기" },
    { value: "ACTIVE", label: "활성" },
    { value: "INACTIVE", label: "비활성" },
  ];

  const handleAddMaterial = (material: MaterialResponseDTO) => {
    const existingMaterial = bomMaterials.find(
      (m) => m.materialId === material.id,
    );
    if (existingMaterial) {
      showError("중복 오류", "이미 추가된 원자재입니다.");
      return;
    }

    const newMaterial: BomMaterial = {
      materialId: material.id!,
      materialName: material.name || "",
      materialCode: material.materialCode || "",
      quantity: 1,
      unit: material.materialUnit || "",
      standardCost: material.standardCost || 0,
    };
    setBomMaterials((prev) => [...prev, newMaterial]);
    setShowMaterialModal(false);
  };

  const handleQuantityChange = (materialId: number, quantity: number) => {
    if (quantity < 1) return;
    setBomMaterials((prev) =>
      prev.map((item) =>
        item.materialId === materialId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleRemoveMaterial = (materialId: number) => {
    setBomMaterials((prev) =>
      prev.filter((item) => item.materialId !== materialId),
    );
  };

  const validateForm = () => {
    if (!isEditMode) {
      // 생성 모드에서는 partCode가 필요
      const partCode = extractPartCode(selectedPart);
      if (!partCode) {
        showError("입력 오류", "품목을 선택해주세요.");
        return false;
      }
    }
    if (bomMaterials.length === 0) {
      showError("입력 오류", "최소 1개 이상의 원자재가 필요합니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const partCode = isEditMode
      ? bomData?.partCode
      : extractPartCode(selectedPart);

    if (!partCode) {
      showError("입력 오류", "품목을 선택해주세요.");
      return;
    }

    // partId 가져오기
    const partId = isEditMode ? bomData?.partId : selectedPartId;

    if (!partId) {
      showError("입력 오류", "품목 ID를 찾을 수 없습니다.");
      return;
    }

    if (isEditMode) {
      // 수정 모드
      updateMutation.mutate(
        {
          params: {
            path: {
              bomId: bomId!,
            },
          },
          body: {
            partId: partId,
            bomStatus,
            materials: bomMaterials.map((m) => ({
              materialId: m.materialId,
              quantity: m.quantity,
            })),
          },
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "BOM이 성공적으로 수정되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("수정 실패", "BOM 수정 중 오류가 발생했습니다.");
          },
        },
      );
    } else {
      // 생성 모드
      createMutation.mutate(
        {
          body: {
            partId: partId,
            bomStatus,
            materials: bomMaterials.map((m) => ({
              materialId: m.materialId,
              quantity: m.quantity,
            })),
          },
        },
        {
          onSuccess: () => {
            showSuccess("등록 완료", "BOM이 성공적으로 등록되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("등록 실패", "BOM 등록 중 오류가 발생했습니다.");
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!bomId) return;

    showConfirm({
      title: "BOM 삭제",
      message: `"${bomData?.partName || bomData?.partCode}" BOM을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
      onConfirm: () => {
        deleteMutation.mutate(
          {
            params: {
              path: {
                bomId: bomId,
              },
            },
          },
          {
            onSuccess: () => {
              showSuccess("삭제 완료", "BOM이 성공적으로 삭제되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("삭제 실패", "BOM 삭제에 실패했습니다.");
            },
          },
        );
      },
    });
  };

  const totalCost = bomMaterials.reduce(
    (sum, item) => sum + item.standardCost * item.quantity,
    0,
  );
  const totalQuantity = bomMaterials.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const getComplexityLevel = () => {
    const itemCount = bomMaterials.length;
    if (itemCount <= 5) return { level: "단순", color: "text-green-600" };
    if (itemCount <= 15) return { level: "보통", color: "text-yellow-600" };
    return { level: "복잡", color: "text-red-600" };
  };

  const complexity = getComplexityLevel();
  const materials = materialsData?.data?.content ?? [];

  return (
    <>
      <Card className="dark:border-gray-700 dark:bg-bg-card-black">
        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              기본 정보
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* 품목 선택 - 셀렉트 3개 구조 */}
              <div className="md:col-span-2">
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
                        value={extractPartCode(selectedPart)}
                        onChange={(e) => handlePartChange(e.target.value)}
                        options={partOptions}
                        disabled={!selectedGroupId || isEditMode}
                      />
                    </>
                  ) : (
                    <>
                      <Select
                        label="카테고리"
                        value={categoryName || ""}
                        options={
                          categoryName
                            ? [
                                {
                                  value: categoryName,
                                  label: categoryName,
                                },
                              ]
                            : []
                        }
                        disabled
                      />
                      <Select
                        label="그룹"
                        value={groupName || ""}
                        options={
                          groupName
                            ? [
                                {
                                  value: groupName,
                                  label: groupName,
                                },
                              ]
                            : []
                        }
                        disabled
                      />
                      <Select
                        label="품목"
                        value={
                          bomData?.partCode && bomData?.partName
                            ? `[${bomData.partCode}] ${bomData.partName}`
                            : ""
                        }
                        options={
                          bomData?.partCode && bomData?.partName
                            ? [
                                {
                                  value: `[${bomData.partCode}] ${bomData.partName}`,
                                  label: `[${bomData.partCode}] ${bomData.partName}`,
                                },
                              ]
                            : []
                        }
                        disabled
                      />
                    </>
                  )}
                </div>
              </div>
              <Select
                label="상태"
                value={bomStatus}
                onChange={(e) =>
                  setBomStatus(
                    e.target.value as
                      | "ACTIVE"
                      | "REVIEWING"
                      | "INACTIVE"
                      | "PENDING_APPROVAL",
                  )
                }
                options={statusOptions}
              />
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                구성품 목록 (원자재)
                {bomMaterials.length > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
                    {bomMaterials.length}개
                  </span>
                )}
              </h3>
              <Button
                onClick={() => setShowMaterialModal(true)}
                className="flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                원자재 추가
              </Button>
            </div>

            {bomMaterials.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <i className="ri-inbox-line mb-4 text-4xl text-gray-400"></i>
                <p className="mb-2 text-lg text-gray-600">
                  등록된 원자재가 없습니다
                </p>
                <p className="text-sm text-gray-500">
                  원자재 추가 버튼을 클릭하여 구성품을 추가하세요
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          원자재 코드
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          원자재명
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">
                          수량
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">
                          단위
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">
                          단가
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-gray-700">
                          총액
                        </th>
                        <th className="px-4 py-3 text-center font-medium text-gray-700">
                          작업
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bomMaterials.map((item) => (
                        <tr key={item.materialId} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                              {item.materialCode}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {item.materialName}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.materialId,
                                  Number(e.target.value),
                                )
                              }
                              className="w-20 rounded border px-2 py-1 text-center focus:ring-2 focus:ring-main-500 focus:outline-none"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3 text-center text-gray-600">
                            {item.unit}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">
                            ₩{item.standardCost.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            ₩
                            {(
                              item.standardCost * item.quantity
                            ).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                handleRemoveMaterial(item.materialId)
                              }
                              className="rounded p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                              title="삭제"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {bomMaterials.length > 0 && (
            <div className="rounded-lg bg-gray-50 p-6">
              <h4 className="mb-4 text-lg font-semibold text-gray-900">
                요약 정보
              </h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {bomMaterials.length}
                  </div>
                  <div className="text-sm text-gray-600">원자재 수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalQuantity}
                  </div>
                  <div className="text-sm text-gray-600">총 수량</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${complexity.color}`}>
                    {complexity.level}
                  </div>
                  <div className="text-sm text-gray-600">복잡도</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ₩{totalCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">총 원가</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
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
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
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
      </Card>

      <Modal
        open={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        title="원자재 선택"
        widthClassName="max-w-6xl"
      >
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="원자재명 또는 코드로 검색..."
                value={materialSearchTerm}
                onChange={(e) => setMaterialSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-48">
              <Select
                label="카테고리"
                value={materialCategoryId}
                onChange={(e) => setMaterialCategoryId(e.target.value)}
                options={categoryOptions}
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid gap-3">
              {materialsLoading ? (
                <div className="py-12 text-center text-gray-500">
                  <i className="ri-loader-4-line mb-4 animate-spin text-4xl"></i>
                  <p>원자재를 불러오는 중...</p>
                </div>
              ) : materials.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <i className="ri-search-line mb-4 text-4xl"></i>
                  <p>검색 조건에 맞는 원자재가 없습니다</p>
                </div>
              ) : (
                materials.map((material) => (
                  <div
                    key={material.id}
                    className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50"
                    onClick={() => handleAddMaterial(material)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                            {material.materialCode}
                          </span>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            원자재
                          </span>
                        </div>
                        <h4 className="mb-1 font-semibold text-gray-900">
                          {material.name}
                        </h4>
                        {material.materialCategoryName && (
                          <p className="mb-2 text-sm text-gray-600">
                            {material.materialCategoryName}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>단위: {material.materialUnit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₩{(material.standardCost || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">단가</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
