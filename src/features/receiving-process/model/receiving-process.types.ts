import type { z } from "zod";

import type { ReceivingProcessResponse } from "@/shared/api/models";

import type { ReceivingProcessSchema } from "./receiving-process.contract";

// 모든 type들을 모아둔 것

export type ReceivingProcess = z.infer<typeof ReceivingProcessSchema>;

// 발주정보 데이터에 대한 type 정의 (ReceivingProcessResponse의 alias)
export type PurchaseOrderInfo = ReceivingProcessResponse;

export type ReceivingProcessFormProps = {
  warehouseId: number;
  processId: number;
  onSucess?: () => void;
  onCancel?: () => void;
};
