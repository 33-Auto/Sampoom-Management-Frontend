import { api } from "@/shared/api";

export const usePartGroupsQuery = (categoryId?: number) =>
  api.useQuery(
    "get",
    "/api/part/parts/categories/{categoryId}/groups",
    {
      params: {
        path: {
          categoryId: categoryId as number,
        },
      },
    },
    // 카테고리를 고르기 전(undefined/NaN)에는 요청하지 않는다
    { enabled: Number.isFinite(categoryId) },
  );
