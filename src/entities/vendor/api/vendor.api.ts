import { queryClient } from "@/shared/api/base";

export const useVendorsQuery = () =>
  queryClient.useQuery("get", "/api/site/vendors");
