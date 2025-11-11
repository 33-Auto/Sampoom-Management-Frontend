import { queryClient } from "@/shared/api/base";

const getRawOptions = () => ({
  params: {},
});

export const wmsBranchesQueryOptions = () =>
  queryClient.queryOptions(
    "get",
    "/api/site/branches/warehouses",
    getRawOptions(),
  );

export const useWmsBrancesQuery = () =>
  queryClient.useQuery("get", "/api/site/branches/warehouses", getRawOptions());
