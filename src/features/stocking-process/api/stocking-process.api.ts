import { useQueryClient } from "@tanstack/react-query";

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

export const useStockingMutation = () => {
  const queryClient = useQueryClient();

  return api.useMutation("patch", "/api/warehouse/stocking", {
    onSuccess: async (_data, { body }) => {
      // 입고 화면 로더는 캐시를 그대로 쓰니 상세는 지워 다음에 새로 받는다
      queryClient.removeQueries({
        queryKey: stockingProcessQueryOptions(body.purchaseOrderId).queryKey,
      });
      // 발주 목록의 입고·미입고 수량과 상태를 다시 받는다
      await queryClient.invalidateQueries({
        queryKey: ["get", "/api/warehouse/po"],
      });
    },
  });
};
