import { queryClient } from "@/shared/api";
import type { Schemas } from "@/shared/model";

import { stockingProcessQueryOptions } from "./stocking-process.api";

export async function stockingProcessLoader(purchaseOrderId: number) {
  return queryClient.ensureQueryData(
    stockingProcessQueryOptions(purchaseOrderId),
  ) as Promise<Schemas["ApiResponsePOResDto"]>;
}

export type StockingProcessLoaderResult = Awaited<
  ReturnType<typeof stockingProcessLoader>
>;
