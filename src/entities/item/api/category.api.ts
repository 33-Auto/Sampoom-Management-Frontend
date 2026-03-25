import { api } from "@/shared/api";
export const itemCategoriesQueryOptions = () =>
  api.queryOptions("get", "/api/part/parts/categories", {});

export const useItemCategoriesQuery = () =>
  api.useQuery("get", "/api/part/parts/categories", {});
