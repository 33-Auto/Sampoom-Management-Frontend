import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api";

export const useShippingProcessMutation = () => {
  const queryClient = useQueryClient();

  return api.useMutation("patch", "/api/warehouse/delivery", {
    // 출고 지시 목록을 다시 받아 바뀐 상태를 보여 준다
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: ["get", "/api/order/outbound"],
      }),
  });
};
