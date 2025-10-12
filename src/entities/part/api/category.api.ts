import { queryClient } from "@/shared/api";export const usePartCategoriesQuery = () =>
  queryClient.useQuery("get", "/api/part/parts/categories");
