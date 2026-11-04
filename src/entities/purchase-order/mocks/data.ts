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
 * 창고 발주 목록·입고 처리 데이터는 purchase-orders.data.ts를 참고하세요.
 */
export const mockPurchaseOrderData: PurchaseOrder[] = [
  {
    id: 7101,
    orderCode: "PO-2026-00123",
    vendorId: 501,
    vendorName: "코리아 모터스",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "PARTIAL",
    orderDate: "2026-10-11T09:00:00+09:00",
    requiredDate: "2026-10-27T10:00:00+09:00",
    totalAmount: 18500000,
    itemCount: 3,
  },
  {
    id: 7102,
    orderCode: "PO-2026-00124",
    vendorId: 502,
    vendorName: "한빛 기전",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    status: "APPROVED",
    orderDate: "2026-10-13T10:00:00+09:00",
    requiredDate: "2026-10-30T10:00:00+09:00",
    totalAmount: 32000000,
    itemCount: 2,
  },
  {
    id: 7103,
    orderCode: "PO-2026-00125",
    vendorId: 503,
    vendorName: "동아 부품",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "COMPLETED",
    orderDate: "2026-10-06T09:00:00+09:00",
    requiredDate: "2026-10-19T10:00:00+09:00",
    totalAmount: 9600000,
    itemCount: 1,
  },
  {
    id: 7104,
    orderCode: "PO-2026-00126",
    vendorId: 504,
    vendorName: "서진 오토",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    status: "REQUESTED",
    orderDate: "2026-10-19T11:00:00+09:00",
    requiredDate: "2026-11-03T10:00:00+09:00",
    totalAmount: 42000000,
    itemCount: 2,
  },
  {
    id: 7105,
    orderCode: "PO-2026-00127",
    vendorId: 505,
    vendorName: "대한 자동차 부품",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "IN_PROGRESS",
    orderDate: "2026-10-16T09:00:00+09:00",
    requiredDate: "2026-11-01T10:00:00+09:00",
    totalAmount: 28000000,
    itemCount: 4,
  },
  {
    id: 7106,
    orderCode: "PO-2026-00128",
    vendorId: 506,
    vendorName: "태양 전자 부품",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    status: "APPROVED",
    orderDate: "2026-10-17T10:00:00+09:00",
    requiredDate: "2026-11-06T10:00:00+09:00",
    totalAmount: 15000000,
    itemCount: 3,
  },
  {
    id: 7107,
    orderCode: "PO-2026-00129",
    vendorId: 507,
    vendorName: "한국 섀시 시스템",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    status: "PARTIAL",
    orderDate: "2026-10-15T09:00:00+09:00",
    requiredDate: "2026-10-30T10:00:00+09:00",
    totalAmount: 22000000,
    itemCount: 2,
  },
  {
    id: 7108,
    orderCode: "PO-2026-00130",
    vendorId: 508,
    vendorName: "프리미엄 모터스",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    status: "COMPLETED",
    orderDate: "2026-10-09T09:00:00+09:00",
    requiredDate: "2026-10-21T10:00:00+09:00",
    totalAmount: 18000000,
    itemCount: 1,
  },
];
