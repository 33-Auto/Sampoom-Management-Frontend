import { api } from "@/shared/api";

export const useAgencyBranchesQuery = () =>
  api.useQuery("get", "/api/site/vendors");
