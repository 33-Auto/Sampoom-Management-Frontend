import { api } from "@/shared/api";

export const usePartGroupsQuery = (categoryId?: number) =>
  api.useQuery("get", "/api/part/parts/categories/{categoryId}/groups", {
    params: {
      path: {
        categoryId: categoryId as number,
      },
    },
  });
