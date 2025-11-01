import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Card, Input, Select } from "@/shared/ui";

import {
  useCreateMaterialMutation,
  useCreatePartMutation,
  useMaterialCategoriesQuery,
  usePartCategoriesQuery,
  usePartGroupsQuery,
} from "../api/create.api";

interface ItemCreateProps {
  onClose?: () => void;
}

export const ItemCreate = ({ onClose }: ItemCreateProps) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "", // MATERIAL | PART
    // MATERIAL 전용
    materialCategoryId: "",
    materialUnit: "",
    // PART 전용
    partCategoryId: "",
    groupId: "",
    // 공통
    description: "",
    baseQuantity: "",
    leadTime: "",
    partUnit: "",
  });

  const itemTypes = [
    { value: "", label: "품목 유형 선택" },
    { value: "MATERIAL", label: "원자재 (MATERIAL)" },
    { value: "PART", label: "부품 (PART)" },
  ];

  // 서버 카테고리/그룹 쿼리
  const { data: materialCategoriesData, isLoading: isLoadingMatCat } =
    useMaterialCategoriesQuery();
  const { data: partCategoriesData, isLoading: isLoadingPartCat } =
    usePartCategoriesQuery();
  const selectedPartCategoryId = useMemo(
    () => Number(formData.partCategoryId) || undefined,
    [formData.partCategoryId],
  );
  const { data: partGroupsData, isLoading: isLoadingGroups } =
    usePartGroupsQuery(selectedPartCategoryId);

  const units = [
    { value: "", label: "단위 선택" },
    { value: "ea", label: "개" },
    { value: "kg", label: "kg" },
    { value: "eared", label: "리터" },
    { value: "meter", label: "미터" },
    { value: "box", label: "박스" },
  ];

  // mutations
  const createMaterialMutation = useCreateMaterialMutation();
  const createPartMutation = useCreatePartMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showError("입력 오류", "품목명을 입력해주세요.");
      return false;
    }
    if (!formData.type) {
      showError("입력 오류", "품목 유형을 선택해주세요.");
      return false;
    }
    if (formData.type === "MATERIAL") {
      if (!formData.materialCategoryId) {
        showError("입력 오류", "카테고리를 선택해주세요.");
        return false;
      }
      if (!formData.materialUnit) {
        showError("입력 오류", "기본 단위를 선택해주세요.");
        return false;
      }
    }
    if (formData.type === "PART") {
      if (!formData.partCategoryId) {
        showError("입력 오류", "카테고리를 선택해주세요.");
        return false;
      }
      if (!formData.groupId) {
        showError("입력 오류", "그룹을 선택해주세요.");
        return false;
      }
      if (!formData.partUnit) {
        showError("입력 오류", "기본 단위를 선택해주세요.");
        return false;
      }
    }
    if (formData.baseQuantity === "" || isNaN(Number(formData.baseQuantity))) {
      showError("입력 오류", "기준 수량을 숫자로 입력해주세요.");
      return false;
    }
    if (formData.leadTime === "" || isNaN(Number(formData.leadTime))) {
      showError("입력 오류", "리드 타임을 숫자로 입력해주세요.");
      return false;
    }
    return true;
  };

  const categoryOptions = useMemo(() => {
    if (formData.type === "MATERIAL") {
      const list = materialCategoriesData || [];
      return [{ value: "", label: "카테고리 선택" }].concat(
        list.map((c) => ({ value: String(c.id), label: c.name })),
      );
    }
    if (formData.type === "PART") {
      const list = partCategoriesData || [];
      return [{ value: "", label: "카테고리 선택" }].concat(
        list.map((c) => ({
          value: String(c.categoryId),
          label: c.categoryName,
        })),
      );
    }
    return [{ value: "", label: "먼저 품목 유형을 선택하세요" }];
  }, [formData.type, materialCategoriesData, partCategoriesData]);

  const groupOptions = useMemo(() => {
    if (formData.type !== "PART") return [];
    const list = partGroupsData || [];
    return [{ value: "", label: "그룹 선택" }].concat(
      list.map((g) => ({ value: String(g.groupId), label: g.groupName })),
    );
  }, [formData.type, partGroupsData]);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (formData.type === "MATERIAL") {
        await createMaterialMutation.mutateAsync({
          name: formData.name.trim(),
          materialCategoryId: Number(formData.materialCategoryId),
          materialUnit: formData.materialUnit,
          baseQuantity: Number(formData.baseQuantity),
          leadTime: Number(formData.leadTime),
        });
      } else if (formData.type === "PART") {
        await createPartMutation.mutateAsync({
          name: formData.name.trim(),
          groupId: Number(formData.groupId),
          partUnit: formData.partUnit,
          baseQuantity: Number(formData.baseQuantity),
          leadTime: Number(formData.leadTime),
        });
      }
      showSuccess("등록 완료", "품목이 성공적으로 등록되었습니다.");
      alert("등록이 완료되었습니다.");
      if (onClose) return onClose();
      navigate("/master/items");
    } catch {
      showError("등록 실패", "품목 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) return onClose();
    navigate("/master/items");
  };

  return (
    <>
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="mb-2 flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <i className="ri-arrow-left-line text-gray-600 dark:text-gray-400"></i>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                품목 신규 등록
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              새로운 품목 정보를 입력하여 등록합니다. 품목 코드는 자동으로
              생성됩니다.
            </p>
          </div>

          <Card className="dark:border-gray-700 dark:bg-bg-card-black">
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="품목명"
                    placeholder="스테인리스 볼트"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <Select
                    label="품목 유형"
                    options={itemTypes}
                    value={formData.type}
                    onChange={(e) => {
                      handleInputChange("type", e.target.value);
                      // reset dependent fields
                      handleInputChange("materialCategoryId", "");
                      handleInputChange("partCategoryId", "");
                      handleInputChange("groupId", "");
                      handleInputChange("materialUnit", "");
                    }}
                  />
                  {/* Category for MATERIAL */}
                  {formData.type === "MATERIAL" && (
                    <Select
                      label={
                        isLoadingMatCat ? "카테고리 (불러오는 중)" : "카테고리"
                      }
                      options={categoryOptions}
                      value={formData.materialCategoryId}
                      onChange={(e) =>
                        handleInputChange("materialCategoryId", e.target.value)
                      }
                      disabled={isLoadingMatCat}
                    />
                  )}
                  {/* Category for PART */}
                  {formData.type === "PART" && (
                    <Select
                      label={
                        isLoadingPartCat ? "카테고리 (불러오는 중)" : "카테고리"
                      }
                      options={categoryOptions}
                      value={formData.partCategoryId}
                      onChange={(e) => {
                        handleInputChange("partCategoryId", e.target.value);
                        handleInputChange("groupId", "");
                      }}
                      disabled={isLoadingPartCat}
                    />
                  )}
                  {/* Group for PART */}
                  {formData.type === "PART" && (
                    <Select
                      label={isLoadingGroups ? "그룹 (불러오는 중)" : "그룹"}
                      options={groupOptions}
                      value={formData.groupId}
                      onChange={(e) =>
                        handleInputChange("groupId", e.target.value)
                      }
                      disabled={isLoadingGroups || !formData.partCategoryId}
                    />
                  )}
                  {/* Unit for MATERIAL */}
                  {formData.type === "MATERIAL" && (
                    <Select
                      label="기본 단위"
                      options={units}
                      value={formData.materialUnit}
                      onChange={(e) =>
                        handleInputChange("materialUnit", e.target.value)
                      }
                    />
                  )}
                  {/* Unit for PART */}
                  {formData.type === "PART" && (
                    <Select
                      label="기본 단위"
                      options={units}
                      value={formData.partUnit}
                      onChange={(e) =>
                        handleInputChange("partUnit", e.target.value)
                      }
                    />
                  )}
                  {/* Base Quantity */}
                  <Input
                    label="기준 수량"
                    type="number"
                    placeholder="0"
                    value={formData.baseQuantity}
                    onChange={(e) =>
                      handleInputChange("baseQuantity", e.target.value)
                    }
                  />
                  {/* Lead Time */}
                  <Input
                    label="리드 타임 (일)"
                    type="number"
                    placeholder="0"
                    value={formData.leadTime}
                    onChange={(e) =>
                      handleInputChange("leadTime", e.target.value)
                    }
                  />
                </div>
              </div>

              {/** 가격 정보 섹션 임시 비활성화 */}
              {null}

              {/** 재고 관리 섹션 임시 비활성화 */}
              {null}

              {/** 공급업체 섹션 임시 비활성화 */}
              {null}

              {/** 추가 정보 섹션 임시 비활성화 */}
              {null}
            </div>

            <div className="mt-8 flex justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                loading={loading}
              >
                등록
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};
