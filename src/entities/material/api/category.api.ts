import { api } from "@/shared/api";

export const useMaterialCategoriesQuery = () =>
  api.useQuery("get", "/api/part/materials/category");
