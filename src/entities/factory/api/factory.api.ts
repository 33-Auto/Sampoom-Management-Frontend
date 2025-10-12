import { queryClient } from "@/shared/api";const getRawOptions = () => ({
  params: {},
});

export const factoryBranchesQueryOptions = () =>
  queryClient.queryOptions(
    "get",
    "/api/site/branches/factories",
    getRawOptions(),
  );

export const useFactoryBranchesQuery = () =>
  queryClient.useQuery("get", "/api/site/branches/factories", getRawOptions());
