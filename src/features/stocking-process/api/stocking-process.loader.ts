import { tanstackQueryClient } from "@/shared/api";import { stockingProcessQueryOptions } from "./stocking-process.api";export async function stockingProcessLoader(purchaseOrderId: number) {
  return tanstackQueryClient.ensureQueryData(
    stockingProcessQueryOptions(purchaseOrderId),
  );
}

export type StockingProcessLoaderResult = Awaited<
  ReturnType<typeof stockingProcessLoader>
>;
