import { queryClient } from "@/shared/api/query";

import { partnersListQueryOptions } from "./partners.api";

export function partnersLoader() {
  queryClient.prefetchQuery(partnersListQueryOptions({}));
  return null;
}
