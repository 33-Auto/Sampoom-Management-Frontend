import { queryClient } from "@/shared/api/query";

import { requestedOrdersQueryOptions } from "./order.api";

export function loader() {
  const ordersPromise = queryClient.ensureQueryData(
    requestedOrdersQueryOptions,
  );
  return { orders: ordersPromise };
}
