import { queryClient } from "@/shared/api/base";

export const useWmsBrancesQuery = () =>
  queryClient.useQuery("get", "/api/site/branches/warehouses");
