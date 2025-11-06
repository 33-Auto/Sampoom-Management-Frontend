import { queryClient } from "@/shared/api";
export const useMaterialCategoryQuery = () =>
  queryClient.useQuery("get", "/api/part/parts/categories");
