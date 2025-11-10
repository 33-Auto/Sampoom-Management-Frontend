import { queryClient } from "@/shared/api/base";

export const useFactoryBranchesQuery = () =>
  queryClient.useQuery("get", "/api/site/branches/factories");
