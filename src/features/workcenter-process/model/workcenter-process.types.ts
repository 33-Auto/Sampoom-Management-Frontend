import type { WorkCenterResponseDTO } from "@/pages/master/workcenters/model";export type WorkCenterProcessFormProps = {
  workCenterId?: number;
  workCenterData?: WorkCenterResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
