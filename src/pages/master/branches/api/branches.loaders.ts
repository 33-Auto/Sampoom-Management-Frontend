import { queryClient } from "@/shared/api";

import { branchesListQueryOptions } from "./branches.api";

export function branchesLoader() {
  queryClient.prefetchQuery(branchesListQueryOptions({}));
  return null;
}
