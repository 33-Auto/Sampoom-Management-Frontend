import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Input, Select } from "@/shared/ui";

import {
  useMaterialCategoriesQuery,
  usePartGroupsQuery,
  usePartCategoriesQuery,
  useUpdateMaterialMutation,
  useUpdatePartMutation,
  useDeleteMaterialMutation,
  useDeletePartMutation,
  useMaterialDetailQuery,
  usePartDetailQuery,
} from "../../create/api/create.api";

interface ItemEditProps {
  onClose?: () => void;
  initialItem?: any;
}

export const ItemEdit = ({ onClose, initialItem }: ItemEditProps) => {
  const navigate = useNavigate();
  const params = useParams<{ type: string; id: string }>();
  const location = useLocation() as any;
  const routedItem = location?.state?.item;
  const sourceItem = initialItem ?? routedItem;
  const { showSuccess, showError } = useNotification();
  const typeParam = sourceItem?.itemType
    ? sourceItem.itemType === "원자재"
      ? "MATERIAL"
      : "PART"
    : params.type || "";
  const id =
    sourceItem?.id !== undefined && sourceItem?.id !== null
      ? Number(sourceItem.id)
      : Number(params.id);

  // Fetch detail data when sourceItem is not available (direct URL access, refresh, etc.)
  const { data: materialDetail } = useMaterialDetailQuery(
    typeParam === "MATERIAL" ? id : undefined,
  );
  const { data: partDetail } = usePartDetailQuery(
    typeParam === "PART" ? id : undefined,
  );

  // Resolve item: prefer sourceItem, fallback to detail query data
  const resolvedItem =
    sourceItem ??
    (typeParam === "MATERIAL"
      ? materialDetail
      : typeParam === "PART"
        ? partDetail
        : materialDetail || partDetail);

  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    // MATERIAL
    materialCategoryId: "",
    materialUnit: "",
    // PART
    partUnit: "",
    baseQuantity: "",
    leadTime: "",
    // PART only (not required by update payload, but we keep for potential UI)
    partCategoryId: "",
    groupId: "",
  });

  const { data: materialCategories } = useMaterialCategoriesQuery();
  const { data: partCategories } = usePartCategoriesQuery();
  const selectedPartCategoryId = useMemo(
    () => Number(formData.partCategoryId) || undefined,
    [formData.partCategoryId],
  );
  const { data: partGroups } = usePartGroupsQuery(selectedPartCategoryId);

  useEffect(() => {
    const src = resolvedItem;
    if (!src) return;
    const leadTime =
      src.purchaseLeadTime ?? src.productionLeadTime ?? src.leadTime ?? 0;
    if (typeParam === "MATERIAL") {
      setFormData((prev) => ({
        ...prev,
        name: src.itemName || src.name || "",
        materialCategoryId: String(
          src.categoryId ?? src.materialCategoryId ?? "",
        ),
        materialUnit: src.materialUnit ?? src.unit ?? "",
        baseQuantity: String(src.baseQuantity ?? ""),
        leadTime: String(leadTime ?? ""),
      }));
    } else if (typeParam === "PART") {
      setFormData((prev) => ({
        ...prev,
        name: src.itemName || src.name || "",
        partUnit: src.partUnit ?? src.unit ?? "",
        baseQuantity: String(src.baseQuantity ?? ""),
        leadTime: String(leadTime ?? ""),
        partCategoryId: String(src.categoryId ?? ""),
        groupId: String(src.groupId ?? ""),
      }));
    }
  }, [resolvedItem, typeParam]);

  const units = [
    { value: "", label: "단위 선택" },
    { value: "ea", label: "개" },
    { value: "kg", label: "kg" },
    { value: "m", label: "미터" },
    { value: "l", label: "리터" },
    { value: "box", label: "박스" },
  ];

  const categoryOptions = useMemo(() => {
    if (typeParam === "MATERIAL") {
      const list = materialCategories || [];
      return [{ value: "", label: "카테고리 선택" }].concat(
        list.map((c) => ({ value: String(c.id), label: c.name })),
      );
    }
    if (typeParam === "PART") {
      const list = partCategories || [];
      return [{ value: "", label: "카테고리 선택" }].concat(
        list.map((c) => ({
          value: String(c.categoryId),
          label: c.categoryName,
        })),
      );
    }
    return [];
  }, [typeParam, materialCategories, partCategories]);

  const groupOptions = useMemo(() => {
    if (typeParam !== "PART") return [];
    const list = partGroups || [];
    return [{ value: "", label: "그룹 선택" }].concat(
      list.map((g) => ({ value: String(g.groupId), label: g.groupName })),
    );
  }, [typeParam, partGroups]);

  const updateMaterialMutation = useUpdateMaterialMutation();
  const updatePartMutation = useUpdatePartMutation();
  const deleteMaterialMutation = useDeleteMaterialMutation();
  const deletePartMutation = useDeletePartMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!formData.name.trim()) {
      showError("입력 오류", "품목명을 입력해주세요.");
      return false;
    }
    if (typeParam === "MATERIAL") {
      if (!formData.materialCategoryId) {
        showError("입력 오류", "카테고리를 선택해주세요.");
        return false;
      }
      if (!formData.materialUnit) {
        showError("입력 오류", "기본 단위를 선택해주세요.");
        return false;
      }
    }
    if (typeParam === "PART") {
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

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (typeParam === "MATERIAL") {
        await updateMaterialMutation.mutateAsync({
          id,
          payload: {
            name: formData.name.trim(),
            materialCategoryId: Number(formData.materialCategoryId),
            materialUnit: formData.materialUnit,
            baseQuantity: Number(formData.baseQuantity),
            leadTime: Number(formData.leadTime),
          },
        });
      } else if (typeParam === "PART") {
        await updatePartMutation.mutateAsync({
          id,
          payload: {
            name: formData.name.trim(),
            status:
              (resolvedItem?.status ?? "") === "비활성" ||
              (resolvedItem?.status ?? "") === "INACTIVE"
                ? "INACTIVE"
                : "ACTIVE",
            partUnit: formData.partUnit,
            baseQuantity: Number(formData.baseQuantity),
            leadTime: Number(formData.leadTime),
            groupId: formData.groupId ? Number(formData.groupId) : undefined,
            partCategoryId: formData.partCategoryId
              ? Number(formData.partCategoryId)
              : undefined,
          },
        });
      }
      // invalidate list so changes reflect on return
      await queryClient.invalidateQueries({ queryKey: ["master", "items"] });
      showSuccess("수정 완료", "품목이 성공적으로 수정되었습니다.");
      alert("수정이 완료되었습니다.");
      if (onClose) return onClose();
      navigate("/master/items");
    } catch {
      showError("수정 실패", "품목 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) return onClose();
    navigate("/master/items");
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("정말 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    setLoading(true);
    try {
      if (typeParam === "MATERIAL") {
        await deleteMaterialMutation.mutateAsync(id);
      } else if (typeParam === "PART") {
        await deletePartMutation.mutateAsync(id);
      }
      await queryClient.invalidateQueries({ queryKey: ["master", "items"] });
      showSuccess("삭제 완료", "품목이 삭제되었습니다.");
      alert("삭제가 완료되었습니다.");
      if (onClose) return onClose();
      navigate("/master/items");
    } catch {
      showError("삭제 실패", "품목 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
              품목 수정
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            품목 정보를 수정합니다.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="품목명"
              placeholder="품목명"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <Input label="유형" value={typeParam} disabled />

            {typeParam === "PART" && (
              <Select
                label="카테고리"
                options={categoryOptions}
                value={formData.partCategoryId}
                onChange={(e) => {
                  handleInputChange("partCategoryId", e.target.value);
                  handleInputChange("groupId", "");
                }}
              />
            )}

            {typeParam === "PART" && (
              <Select
                label="그룹"
                options={groupOptions}
                value={formData.groupId}
                onChange={(e) => handleInputChange("groupId", e.target.value)}
                disabled={!formData.partCategoryId}
              />
            )}

            {typeParam === "MATERIAL" && (
              <Select
                label="카테고리"
                options={categoryOptions}
                value={formData.materialCategoryId}
                onChange={(e) =>
                  handleInputChange("materialCategoryId", e.target.value)
                }
              />
            )}

            {typeParam === "PART" && (
              <Select
                label="기본 단위"
                options={units}
                value={formData.partUnit}
                onChange={(e) => handleInputChange("partUnit", e.target.value)}
              />
            )}

            {typeParam === "MATERIAL" && (
              <Select
                label="기본 단위"
                options={units}
                value={formData.materialUnit}
                onChange={(e) =>
                  handleInputChange("materialUnit", e.target.value)
                }
              />
            )}

            <Input
              label="기준 수량"
              type="number"
              placeholder="0"
              value={formData.baseQuantity}
              onChange={(e) =>
                handleInputChange("baseQuantity", e.target.value)
              }
            />
            <Input
              label="리드 타임 (일)"
              type="number"
              placeholder="0"
              value={formData.leadTime}
              onChange={(e) => handleInputChange("leadTime", e.target.value)}
            />
          </div>

          <div className="mt-8 flex justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button
              variant="secondary"
              style={{ color: "var(--color-error-red)" }}
              onClick={handleDelete}
              disabled={loading}
            >
              삭제
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              취소
            </Button>
            <Button variant="default" onClick={handleSubmit} loading={loading}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemEdit;
