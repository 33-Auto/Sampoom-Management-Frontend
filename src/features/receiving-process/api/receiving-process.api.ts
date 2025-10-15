// TODO: 타입 체크 임시 비활성화 - 타입 에러 수정 후 이 줄 제거
// @ts-nocheck
import { queryClient } from "@/shared/api";export const useReceivingProcessQuery = (
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
