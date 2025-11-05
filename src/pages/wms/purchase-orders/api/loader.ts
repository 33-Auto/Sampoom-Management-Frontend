import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import { purchaseOrderListQueryOptions } from "./purchase-orders.api";

export function loader() {
  tanstackQueryClient.prefetchQuery(
    purchaseOrderListQueryOptions({ warehouseId: 40 }),
  );

  return null;
}
