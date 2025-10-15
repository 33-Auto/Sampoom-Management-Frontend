import type { RopResDto } from "@/pages/wms/rop-settings/model";export type RopProcessFormProps = {
  ropId?: number;
  ropData?: RopResDto;
  onSuccess?: () => void;
  onCancel?: () => void;
};
