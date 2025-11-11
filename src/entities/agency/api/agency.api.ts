import { queryClient } from "@/shared/api/base";

export const useAgencyBranchesQuery = () =>
  queryClient.useQuery("get", "/api/site/vendors");
