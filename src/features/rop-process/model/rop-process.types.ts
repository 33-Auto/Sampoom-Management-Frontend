import type { RopSettings } from "@/entities/rop";

export type RopProcessFormProps = {
  ropId?: number;
  ropData?: RopSettings;
  // 창고 ID 생성 시 페이지가 고른 창고를 넘긴다
  warehouseId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};
