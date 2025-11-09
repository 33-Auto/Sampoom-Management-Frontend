import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import { shippingListQueryOptions } from "./shipping-list.api";

export async function loader() {
  await Promise.all([
    tanstackQueryClient.prefetchQuery(
      shippingListQueryOptions({ warehouseId: 168 }),
    ),
  ]);

  return null;
}
