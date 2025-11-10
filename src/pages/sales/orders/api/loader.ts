import { queryClient } from "@/shared/api";
import { queryClient as tanstackQueryClient } from "@/shared/api/query";
import { DEFAULT_WAREHOUSE_ID } from "@/shared/config/warehouse";


import { getSalesOrdersQueryOptions } from "./sales-orders.api";

export function loader() {
  tanstackQueryClient.prefetchQuery(
    queryClient.queryOptions(
      "get",
      "/api/order/warehouse/{warehouseId}",
      getSalesOrdersQueryOptions({ warehouseId: DEFAULT_WAREHOUSE_ID }),
    ),
  );

  return null;
}
