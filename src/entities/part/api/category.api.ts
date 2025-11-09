import { queryClient } from "@/shared/api/base";

export const usePartCategoriesQuery = () =>
  queryClient.useQuery("get", "/api/part/parts/categories");
