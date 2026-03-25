import { queryClient } from "@/shared/api";

import { partnersListQueryOptions } from "./partners.api";

export function partnersLoader() {
  queryClient.prefetchQuery(partnersListQueryOptions({}));
  return null;
}
