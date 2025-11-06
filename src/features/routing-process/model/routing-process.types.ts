import type { z } from "zod";

import type { ProcessResponseDTO } from "@/pages/master/routings/model";

import type { RoutingProcessSchema } from "./routing-process.contract";

export type RoutingProcessFormData = z.infer<typeof RoutingProcessSchema>;

export type RoutingProcessFormProps = {
  routingId?: number;
  routingData?: ProcessResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
