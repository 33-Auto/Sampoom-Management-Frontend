import { api } from "@/shared/api";

export interface PartSearchEntry {
  id: number;
  code: string;
  name: string;
}

export const usePartSearchQuery = (
  partCategoryId: number,
  partGroupId: number,
) =>
  api.useQuery("get", "/api/part/items/search", {
    params: {
      query: {
        partCategoryId,
        partGroupId,
      },
    },
  });
