import { queryClient } from "@/shared/api/base";

export const useShippingProcessMutation = () =>
  queryClient.useMutation("patch", "/api/warehouse/delivery");
