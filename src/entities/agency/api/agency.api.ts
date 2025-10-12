import { queryClient } from "@/shared/api";export const useAgencyBranchesQuery = () =>
  queryClient.useQuery("get", "/api/site/vendors");
