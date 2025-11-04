import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import { shippingListQueryOptions } from "./order.api";

export function loader() {
  tanstackQueryClient.prefetchQuery(shippingListQueryOptions({}));
  tanstackQueryClient.prefetchQuery(shippingListQueryOptions({ page: 1 }));

  return null;
}
