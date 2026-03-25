import { api } from "@/shared/api";

export const useVendorsQuery = () => api.useQuery("get", "/api/site/vendors");
