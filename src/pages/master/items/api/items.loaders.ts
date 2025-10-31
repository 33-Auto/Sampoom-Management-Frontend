import { queryClient } from "@/shared/api/query";

import { itemsMasterQueryOptions } from "./items.api";

export function loader() {
  const itemsPromise = queryClient.ensureQueryData(itemsMasterQueryOptions());
  return { items: itemsPromise };
}
