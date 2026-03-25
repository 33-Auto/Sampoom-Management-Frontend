import { queryClient as tanstackQueryClient } from "@/shared/api";

import { itemsMasterQueryOptions } from "./items.api";

export function loader() {
  const itemsPromise = tanstackQueryClient.ensureQueryData(
    itemsMasterQueryOptions({
      page: 0,
      size: 10,
    }),
  );
  return { items: itemsPromise };
}
