import { queryClient } from "@/shared/api";export const useShippingProcessMutation = () =>
  queryClient.useMutation("patch", "/api/warehouse/delivery");
