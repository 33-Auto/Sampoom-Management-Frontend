import type { RopSettings } from "@/entities/rop";

export type RopProcessFormProps = {
  ropId?: number;
  ropData?: RopSettings;
  onSuccess?: () => void;
  onCancel?: () => void;
};
