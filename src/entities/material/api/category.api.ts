import { queryClient } from "@/shared/api/base";

export const useMaterialCategoriesQuery = () =>
  queryClient.useQuery("get", "/api/part/materials/category");
