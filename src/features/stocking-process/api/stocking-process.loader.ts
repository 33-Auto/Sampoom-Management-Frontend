import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import { stockingProcessQueryOptions } from "./stocking-process.api";

export async function stockingProcessLoader(purchaseOrderId: number) {
  return tanstackQueryClient.ensureQueryData(
    stockingProcessQueryOptions(purchaseOrderId),
  );
}

export type StockingProcessLoaderResult = Awaited<
  ReturnType<typeof stockingProcessLoader>
>;
