import { queryClient } from "@/shared/api";

export function usePartSearchQuery(
  partCategoryId: number,
  partGroupId: number,
) {
  return queryClient.useQuery("get", "/api/part/items/search", {
    params: {
      query: {
        partCategoryId: partCategoryId,
        partGroupId: partGroupId,
      },
    },
  });
}
