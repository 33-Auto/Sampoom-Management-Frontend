export type PurchaseOrderStatus =
  | "REQUESTED"
  | "APPROVED"
  | "IN_PROGRESS"
  | "PARTIAL"
  | "COMPLETED"
  | "CANCELED";

export type PurchaseOrder = {
  id: number;
  orderCode: string;
  vendorId: number;
  vendorName: string;
  warehouseId: number;
  warehouseName: string;
  status: PurchaseOrderStatus;
  orderDate: string;
  requiredDate: string;
  totalAmount: number;
  itemCount: number;
};

/**
 * Purchase-order 엔티티 기본 데이터
 * 필요 시 pages/wms/purchase-orders 모듈의 mocks를 참고하세요.
 */
export const mockPurchaseOrderData: PurchaseOrder[] = [
  {
    id: 7101,
    orderCode: "PO-2025-00123",
    vendorId: 501,
    vendorName: "코리아 모터스",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "PARTIAL",
    orderDate: "2024-12-20T09:00:00+09:00",
    requiredDate: "2025-01-05T10:00:00+09:00",
    totalAmount: 18500000,
    itemCount: 3,
  },
  {
    id: 7102,
    orderCode: "PO-2025-00124",
    vendorId: 502,
    vendorName: "한빛 기전",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    status: "APPROVED",
    orderDate: "2024-12-22T10:00:00+09:00",
    requiredDate: "2025-01-08T10:00:00+09:00",
    totalAmount: 32000000,
    itemCount: 2,
  },
  {
    id: 7103,
    orderCode: "PO-2025-00125",
    vendorId: 503,
    vendorName: "동아 부품",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "COMPLETED",
    orderDate: "2024-12-15T09:00:00+09:00",
    requiredDate: "2024-12-28T10:00:00+09:00",
    totalAmount: 9600000,
    itemCount: 1,
  },
  {
    id: 7104,
    orderCode: "PO-2025-00126",
    vendorId: 504,
    vendorName: "서진 오토",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    status: "REQUESTED",
    orderDate: "2024-12-28T11:00:00+09:00",
    requiredDate: "2025-01-12T10:00:00+09:00",
    totalAmount: 42000000,
    itemCount: 2,
  },
  {
    id: 7105,
    orderCode: "PO-2025-00127",
    vendorId: 505,
    vendorName: "대한 자동차 부품",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "IN_PROGRESS",
    orderDate: "2024-12-25T09:00:00+09:00",
    requiredDate: "2025-01-10T10:00:00+09:00",
    totalAmount: 28000000,
    itemCount: 4,
  },
  {
    id: 7106,
    orderCode: "PO-2025-00128",
    vendorId: 506,
    vendorName: "태양 전자 부품",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "APPROVED",
    orderDate: "2024-12-26T10:00:00+09:00",
    requiredDate: "2025-01-15T10:00:00+09:00",
    totalAmount: 15000000,
    itemCount: 3,
  },
  {
    id: 7107,
    orderCode: "PO-2025-00129",
    vendorId: 507,
    vendorName: "한국 섀시 시스템",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    status: "PARTIAL",
    orderDate: "2024-12-24T09:00:00+09:00",
    requiredDate: "2025-01-08T10:00:00+09:00",
    totalAmount: 22000000,
    itemCount: 2,
  },
  {
    id: 7108,
    orderCode: "PO-2025-00130",
    vendorId: 508,
    vendorName: "프리미엄 모터스",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    status: "COMPLETED",
    orderDate: "2024-12-18T09:00:00+09:00",
    requiredDate: "2024-12-30T10:00:00+09:00",
    totalAmount: 18000000,
    itemCount: 1,
  },
];
