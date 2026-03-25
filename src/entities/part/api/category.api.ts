import { api } from "@/shared/api";

export const usePartCategoriesQuery = () =>
  api.useQuery("get", "/api/part/parts/categories");
