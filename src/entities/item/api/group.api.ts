import { api } from "@/shared/api";
export const itemGroupsQueryOptions = (categoryId?: number) =>
  api.queryOptions("get", "/api/part/parts/categories/{categoryId}/groups", {
    params: {
      path: {
        categoryId: categoryId as number,
      },
    },
  });

export const useItemGroupsQuery = (categoryId?: number) =>
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
    // enabled는 init이 아니라 옵션 인자로 넘겨야 적용된다. NaN도 막는다.
    { enabled: Number.isFinite(categoryId) },
  );
