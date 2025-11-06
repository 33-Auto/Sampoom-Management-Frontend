import { queryClient } from "@/shared/api/query";

import { routingsListQueryOptions } from "./routings.api";

export function routingsLoader() {
  queryClient.prefetchQuery(routingsListQueryOptions({}));
  return null;
}
