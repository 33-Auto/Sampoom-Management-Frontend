import type { WorkCenterResponseDTO } from "@/entities/workcenter";

export type WorkCenterProcessFormProps = {
  workCenterId?: number;
  workCenterData?: WorkCenterResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
