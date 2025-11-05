import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import { inventoryListQueryOptions } from "./inventory.api";

export function loader() {
  tanstackQueryClient.prefetchQuery(
    inventoryListQueryOptions({ warehouseId: 40 }),
  );

  return null;
}
