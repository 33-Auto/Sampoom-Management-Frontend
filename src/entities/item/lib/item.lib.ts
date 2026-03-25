import { useItemCategoriesQuery, useItemGroupsQuery } from "../api";
import { usePartSearchQuery } from "../api/part.api";
// 전체를 포함한 카테고리 옵션 '데이터'들 반환
export function useCategoryOptions() {
  const { data } = useItemCategoriesQuery();

  const baseOption = { label: "전체 카테고리", value: "" };

  const categories =
    data?.data
      ?.filter(
        (category) => category.name !== null && category.name !== undefined,
      )
      .map((category) => ({
        label: category.name!,
        value: String(category.categoryId),
      })) ?? [];

  return [baseOption, ...categories];
}

export function useGroupOptions(categoryId: number) {
  const { data } = useItemGroupsQuery(categoryId);

  const baseOption = { label: "전체 그룹", value: "" };

  const groups =
    data?.data
      ?.filter(
        (group) => group.groupName !== null && group.groupName !== undefined,
      )
      .map((group) => ({
        label: group.groupName!,
        value: String(group.groupId),
      })) ?? [];

  return [baseOption, ...groups];
}

export function usePartOptions(categoryId: number, groupId: number) {
  const { data } = usePartSearchQuery(categoryId, groupId);

  const baseOption = { label: "전체", value: "" };

  const parts =
    data?.data?.content?.map(({ code, name }) => ({
      label: "[" + code + "] " + name!,
      value: code!, // 이것은 무조건 있다고 합의되어서 ! 붙임
    })) ?? [];

  return [baseOption, ...parts];
}
