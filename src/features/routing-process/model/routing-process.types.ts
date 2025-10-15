import type { ProcessResponseDTO } from "@/pages/master/routings/model";export type RoutingProcessFormProps = {
  routingId?: number;
  routingData?: ProcessResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
