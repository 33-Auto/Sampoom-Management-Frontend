import { api } from "@/shared/api";

export const useShippingProcessMutation = () =>
  api.useMutation("patch", "/api/warehouse/delivery");
