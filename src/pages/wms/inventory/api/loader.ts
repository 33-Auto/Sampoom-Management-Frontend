import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import { inventoryListQueryOptions } from "./inventory.api";

export async function loader() {
  await tanstackQueryClient.prefetchQuery(
    inventoryListQueryOptions({ warehouseId: 168 }),
  );

  return null;
}
