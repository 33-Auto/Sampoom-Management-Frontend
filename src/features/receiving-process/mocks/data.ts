import type { ReceivingProcessResponse } from "@/shared/model/models";

// Mock 입고 처리 응답 데이터
export const mockReceivingProcessResponse: ReceivingProcessResponse = {
  warehouseId: 1,
  processId: 1,
  orderNumber: "PO-2024-001",
  expectedDate: "2024-01-15",
  receivingDate: "2024-01-15",
  receivingTime: "14:30",
  itemCode: "RM-AL-001",
  itemName: "알루미늄 합금",
  orderedQuantity: 500,
  receivingQuantity: 300,
  remainingQuantity: 200,
  memo: "품질 검사 완료",
  createdAt: "2024-01-15T14:30:00Z",
};
