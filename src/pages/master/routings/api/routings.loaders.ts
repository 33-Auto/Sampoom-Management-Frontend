import { queryClient } from "@/shared/api";

import { routingsListQueryOptions } from "./routings.api";

export function routingsLoader() {
  queryClient.prefetchQuery(routingsListQueryOptions({}));
  return null;
}
