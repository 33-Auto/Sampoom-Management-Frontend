import { useMaterialCategoryQuery, useMaterialGroupQuery } from "../api";
// 전체를 포함한 카테고리 옵션 '데이터'들 반환
export function useCategoryOptions() {
  const { data } = useMaterialCategoryQuery();

  const baseOption = { label: "전체 카테고리", value: "" };

  const categories =
    data?.data?.map((category) => ({
      label: category.name,
      value: category.categoryId,
    })) ?? [];

  return [baseOption, ...categories];
}

export function useGroupOptions(categoryId: number) {
  const { data } = useMaterialGroupQuery(categoryId);

  const baseOption = { label: "전체 그룹", value: "" };

  const groups =
    data?.data?.map((group) => ({
      label: group.groupName,
      value: group.groupId,
    })) ?? [];

  return [baseOption, ...groups];
}
