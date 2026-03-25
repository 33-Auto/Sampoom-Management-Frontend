import { api } from "@/shared/api";

import type { ItemsMasterParams } from "../model";

const getItemsMasterQueryOptions = (params?: ItemsMasterParams) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      keyword: params?.keyword,
      materialCategoryId: params?.materialCategoryId,
      partCategoryId: params?.partCategoryId,
      partGroupId: params?.partGroupId,
      type: params?.type,
    },
  },
});
export const itemsMasterQueryOptions = (params?: ItemsMasterParams) =>
  api.queryOptions(
    "get",
    "/api/part/items/search",
    getItemsMasterQueryOptions(params),
  );

export const useItemsMasterQuery = (params: ItemsMasterParams) =>
  api.useQuery(
    "get",
    "/api/part/items/search",
    getItemsMasterQueryOptions(params),
    {
      placeholderData: (previousData) => previousData,
    },
  );
