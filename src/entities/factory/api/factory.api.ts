import { api } from "@/shared/api";

const getRawOptions = () => ({
  params: {},
});

export const factoryBranchesQueryOptions = () =>
  api.queryOptions("get", "/api/site/branches/factories", getRawOptions());

export const useFactoryBranchesQuery = () =>
  api.useQuery("get", "/api/site/branches/factories", getRawOptions());
