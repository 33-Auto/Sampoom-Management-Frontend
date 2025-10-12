import { queryClient } from "@/shared/api";export const useMaterialCategoriesQuery = () =>
  queryClient.useQuery("get", "/api/part/materials/category");
