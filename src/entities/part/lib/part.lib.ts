import { useMemo } from "react";

import {
  usePartCategoriesQuery,
  usePartGroupsQuery,
  usePartSearchQuery,
} from "../api";

export function usePartCategoryOptions() {
  const { data } = usePartCategoriesQuery();

  return useMemo(() => {
    const categories = (data as any)?.data ?? data ?? [];
    return [
      { label: "전체 카테고리", value: "" },
      ...categories
        .filter((category: any) => category?.categoryName)
        .map((category: any) => ({
          label: category.categoryName as string,
          value: String(category.categoryId),
        })),
    ];
  }, [data]);
}

export function usePartGroupOptions(categoryId: number) {
  const { data } = usePartGroupsQuery(categoryId);

  return useMemo(() => {
    const groups = (data as any)?.data ?? data ?? [];
    return [
      { label: "전체 그룹", value: "" },
      ...groups
        .filter((group: any) => group?.groupName)
        .map((group: any) => ({
          label: group.groupName as string,
          value: String(group.groupId),
        })),
    ];
  }, [data]);
}

export function usePartSelectOptions(categoryId: number, groupId: number) {
  const { data } = usePartSearchQuery(categoryId, groupId);

  return useMemo(() => {
    const baseOption = { label: "전체", value: "" };

    const parts =
      data?.data?.content?.map(({ id, code, name }) => ({
        label: "[" + code + "] " + name!,
        value: String(id),
      })) ?? [];

    return [baseOption, ...parts];
  }, [data]);
}
