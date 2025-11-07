import { queryClient } from "@/shared/api/base";

export interface PartSearchEntry {
  id: number;
  code: string;
  name: string;
}

export const usePartSearchQuery = (
  partCategoryId: number,
  partGroupId: number,
) =>
  queryClient.useQuery("get", "/api/part/items/search", {
    params: {
      query: {
        partCategoryId,
        partGroupId,
      },
    },
  });
