import { api } from "@/shared/api";

export function usePartSearchQuery(
  partCategoryId: number,
  partGroupId: number,
) {
  return api.useQuery("get", "/api/part/parts", {
    params: {
      query: {
        groupId: partGroupId,
      },
    },
    enabled: !!partGroupId,
  });
}
