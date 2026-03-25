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
  api.useQuery("get", "/api/part/parts/categories/{categoryId}/groups", {
    params: {
      path: {
        categoryId: categoryId as number,
      },
    },
    enabled: typeof categoryId === "number",
  });
