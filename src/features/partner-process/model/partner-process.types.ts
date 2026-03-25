import type { PartnerResponseDTO } from "@/entities/partner";

export type PartnerProcessFormProps = {
  partnerId?: number;
  partnerData?: PartnerResponseDTO;
  onSuccess?: () => void;
  onCancel?: () => void;
};
