import { queryClient } from "@/shared/api/query";

import { workCentersListQueryOptions } from "./workcenters.api";

export function workCentersLoader() {
  queryClient.prefetchQuery(workCentersListQueryOptions({}));
  return null;
}
