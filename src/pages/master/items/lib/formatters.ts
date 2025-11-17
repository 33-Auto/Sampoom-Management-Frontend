import type { ItemResponseDTO } from "@/pages/master/items/model";

const ITEM_TYPE_LABELS: Record<string, string> = {
  MATERIAL: "원자재",
  PART: "부품",
};

export const buildItemTypeFilterOptions = () => [
  { value: "전체", label: "전체 유형" },
  { value: "원자재", label: "원자재" },
  { value: "부품", label: "부품" },
];

export const formatItemTypeLabel = (value?: string | null) => {
  if (!value) return "-";
  return ITEM_TYPE_LABELS[value] ?? value;
};

export const getItemTypeBadgeVariant = (
  value?: string | null,
): "info" | "success" => {
  if (value === "MATERIAL") return "info";
  return "success";
};

export const formatItemCategoryPath = (item: ItemResponseDTO) => {
  const categoryName = item.categoryName || "";
  const groupName = item.groupName || "";

  if (!categoryName && !groupName) return "-";
  return categoryName + (groupName ? ` > ${groupName}` : "");
};

export const formatItemStandardCost = (value?: number | null) => {
  if (typeof value !== "number") return "-";
  return `₩${value.toLocaleString()}`;
};

export const formatItemLeadTime = (value?: number | null) => {
  if (!value) return "-";
  return `${value}일`;
};
