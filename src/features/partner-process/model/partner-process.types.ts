import type { PartnerResponseDTO } from "@/pages/master/partners/model";

export type PartnerProcessFormProps = {
  partnerId?: number;
  partnerData?: PartnerResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
