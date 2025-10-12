import { queryClient } from "@/shared/api";export const stockingProcessQueryOptions = (purchaseOrderId: number) =>
  queryClient.queryOptions("get", "/api/warehouse/po/{purchaseOrderId}", {
    params: {
      path: {
        purchaseOrderId,
      },
    },
  });

export const useStockingProcessQuery = (purchaseOrderId: number) =>
  queryClient.useQuery("get", "/api/warehouse/po/{purchaseOrderId}", {
    params: {
      path: {
        purchaseOrderId,
      },
    },
  });

export const useStockingMutation = () =>
  queryClient.useMutation("patch", "/api/warehouse/stocking");
