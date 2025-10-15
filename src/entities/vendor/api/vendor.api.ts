import { queryClient } from "@/shared/api";export const useVendorsQuery = () =>
  queryClient.useQuery("get", "/api/site/vendors");
