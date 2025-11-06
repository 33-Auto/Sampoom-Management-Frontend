import type { BomDetailResponseDTO } from "../api/bom-process.api";

export type BomProcessFormProps = {
  bomId?: number;
  bomData?: BomDetailResponseDTO;
  categoryName?: string;
  groupName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};
