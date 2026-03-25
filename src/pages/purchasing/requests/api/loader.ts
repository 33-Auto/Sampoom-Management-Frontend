import { queryClient as tanstackQueryClient } from "@/shared/api";

import { purchaseRequestListQueryOptions } from "./purchasing-requests.api";

export function loader() {
  tanstackQueryClient.prefetchQuery(purchaseRequestListQueryOptions({}));

  return null;
}
