import { api } from "@/shared/api";

const getRawOptions = () => ({
  params: {},
});

export const wmsBranchesQueryOptions = () =>
  api.queryOptions("get", "/api/site/branches/warehouses", getRawOptions());

export const useWmsBrancesQuery = () =>
  api.useQuery("get", "/api/site/branches/warehouses", getRawOptions());
