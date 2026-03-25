import { api } from "@/shared/api";

export const stockingProcessQueryOptions = (purchaseOrderId: number) =>
  api.queryOptions("get", "/api/warehouse/po/{purchaseOrderId}", {
    params: {
      path: {
        purchaseOrderId,
      },
    },
  });

export const useStockingProcessQuery = (purchaseOrderId: number) =>
  api.useQuery("get", "/api/warehouse/po/{purchaseOrderId}", {
    params: {
      path: {
        purchaseOrderId,
      },
    },
  });

export const useStockingMutation = () =>
  api.useMutation("patch", "/api/warehouse/stocking");
