import { queryClient } from "@/shared/api/base";
export const queryOptions = queryClient.queryOptions(
  "get",
  //TODO : 추후에 as any를 제거하고 경로 올바르게
  "/api/warehouse/receiving/:warehouseId/group/:groupId" as any,
  {
    params: {
      path: {
        warehouseId: 1,
        groupId: 1,
      },
    },
  },
);
