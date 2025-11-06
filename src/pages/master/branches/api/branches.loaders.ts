import { queryClient } from "@/shared/api/query";

import { branchesListQueryOptions } from "./branches.api";

export function branchesLoader() {
  queryClient.prefetchQuery(branchesListQueryOptions({}));
  return null;
}
