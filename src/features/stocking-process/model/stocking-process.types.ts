import type { Schemas } from "@/shared/model";

import type { StockingProcessFormData } from "./stocking-process.contract";

export type StockingProcessResponse = Schemas["POResDto"];

export interface StockingProcessFormProps {
  purchaseOrderId: number;
  warehouseId: number;
  detail: StockingProcessResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export type { StockingProcessFormData };
