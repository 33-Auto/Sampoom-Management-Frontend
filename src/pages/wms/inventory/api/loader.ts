import { queryClient } from "@/shared/api/query";

import { warehouseInventoryQueryOptions } from "./inventory.api";

export function loader() {
  const inventoryPromise = queryClient.ensureQueryData(
    warehouseInventoryQueryOptions,
  );
  return { orders: inventoryPromise };
}
