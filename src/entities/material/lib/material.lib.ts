import { useMemo } from "react";import { useMaterialCategoriesQuery } from "../api";export function useMaterialCategoryOptions() {
  const { data } = useMaterialCategoriesQuery();

  // useMemo를 사용하여 최적화
  // 여러 페이지에서 사용하기 때문에 data가 변경되지 않으면 함수를 실행시키지않음
  return useMemo(() => {
    const categories = (data as any)?.data ?? data ?? [];
    return [
      { label: "전체 카테고리", value: "" },
      ...categories
        .filter((category: any) => category?.name)
        .map((category: any) => ({
          label: category.name as string,
          value: String(category.id),
        })),
    ];
  }, [data]);
}
