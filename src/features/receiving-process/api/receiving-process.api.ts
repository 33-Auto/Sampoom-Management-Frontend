import { queryClient } from "@/shared/api/base";

export const useReceivingProcessQuery = (
  warehouseId: number,
  processId: number,
) =>
  queryClient.useQuery(
    "get",
    "/api/warehouse/receiving/{warehouseId}/process/{processId}",
    {
      params: {
        path: {
          warehouseId,
          processId,
        },
      },
    },
  );

export const receivingProcessQueryOptions = (
  warehouseId: number,
  processId: number,
) =>
  queryClient.queryOptions(
    "get",
    "/api/warehouse/receiving/{warehouseId}/process/{processId}",
    {
      params: {
        path: {
          warehouseId: warehouseId,
          processId: processId,
        },
      },
    },
  );
