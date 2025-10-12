import type { Schemas } from "@/shared/model";// OrderResDto 타입 정의
export type OrderResDto = Schemas["OrderResDto"];
export type ItemCategoryDto = Schemas["ItemCategoryDto"];
export type ItemGroupDto = Schemas["ItemGroupDto"];
export type ItemPartDto = Schemas["ItemPartDto"];

// 부품 코드를 기반으로 카테고리와 그룹 매핑
const getCategoryAndGroup = (
  partCode: string,
): { categoryId: number; groupId: number } => {
  if (partCode.startsWith("ENG-FUEL-")) return { categoryId: 1, groupId: 11 };
  if (partCode.startsWith("ENG-BLOCK-")) return { categoryId: 1, groupId: 12 };
  if (partCode.startsWith("ENG-COOL-")) return { categoryId: 1, groupId: 13 };
  if (partCode.startsWith("CHS-SUS-")) return { categoryId: 2, groupId: 21 };
  if (partCode.startsWith("CHS-BRAKE-")) return { categoryId: 2, groupId: 22 };
  if (partCode.startsWith("CHS-STEER-")) return { categoryId: 2, groupId: 23 };
  if (partCode.startsWith("ELE-SENSOR-")) return { categoryId: 3, groupId: 31 };
  if (partCode.startsWith("ELE-ECU-")) return { categoryId: 3, groupId: 32 };
  if (partCode.startsWith("COOL-RAD-")) return { categoryId: 4, groupId: 41 };
  if (partCode.startsWith("EXH-MAN-")) return { categoryId: 5, groupId: 51 };
  // 기본값
  return { categoryId: 1, groupId: 11 };
};

const getCategoryName = (categoryId: number): string => {
  const names: Record<number, string> = {
    1: "엔진 부품",
    2: "섀시 부품",
    3: "전자 부품",
    4: "냉각 시스템",
    5: "배기 시스템",
  };
  return names[categoryId] || "기타";
};

const getGroupName = (groupId: number): string => {
  const names: Record<number, string> = {
    11: "연료 공급",
    12: "엔진 블록",
    13: "냉각 시스템",
    21: "현가 장치",
    22: "제동 장치",
    23: "스티어링",
    31: "센서 모듈",
    32: "제어 모듈",
    41: "라디에이터",
    51: "배기 매니폴드",
  };
  return names[groupId] || "기타";
};

// 부품별 표준 가격 (원)
const getStandardCost = (partCode: string): number => {
  const costs: Record<string, number> = {
    "ENG-FUEL-001": 450000,
    "ENG-FUEL-002": 125000,
    "ENG-FUEL-003": 50000,
    "ENG-BLOCK-010": 3000000,
    "ENG-BLOCK-011": 2500000,
    "CHS-SUS-005": 85000,
    "CHS-SUS-006": 85000,
    "CHS-SUS-007": 120000,
    "CHS-BRAKE-008": 180000,
    "CHS-BRAKE-009": 220000,
    "CHS-BRAKE-010": 280000,
    "CHS-STEER-013": 350000,
    "ELE-SENSOR-003": 19200,
    "ELE-SENSOR-010": 25000,
    "ELE-SENSOR-011": 18000,
    "ELE-ECU-001": 800000,
    "COOL-RAD-001": 150000,
    "EXH-MAN-001": 280000,
  };
  return costs[partCode] || 100000;
};

// items를 중첩 구조로 변환
const transformItems = (
  items: Array<{
    partId: number;
    partCode: string;
    partName: string;
    quantity: number;
    unit: string;
  }>,
): ItemCategoryDto[] => {
  const categoryMap = new Map<number, Map<number, ItemPartDto[]>>();

  items.forEach((item) => {
    const { categoryId, groupId } = getCategoryAndGroup(item.partCode);

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, new Map());
    }
    const groupMap = categoryMap.get(categoryId)!;

    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, []);
    }

    groupMap.get(groupId)!.push({
      partId: item.partId,
      code: item.partCode,
      name: item.partName,
      quantity: item.quantity,
      standardCost: getStandardCost(item.partCode),
    });
  });

  return Array.from(categoryMap.entries()).map(([categoryId, groupMap]) => ({
    categoryId,
    categoryName: getCategoryName(categoryId),
    groups: Array.from(groupMap.entries()).map(([groupId, parts]) => ({
      groupId,
      groupName: getGroupName(groupId),
      parts,
    })),
  }));
};

// 레거시 타입 (내부 사용)
type SalesOrderItem = {
  partId: number;
  partCode: string;
  partName: string;
  quantity: number;
  unit: string;
};

type SalesOrderRecord = {
  orderId: number;
  orderCode: string;
  warehouseId: number;
  warehouseName: string;
  customerName: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELED";
  requestedDate: string;
  completedDate?: string;
  items: SalesOrderItem[];
};

export const mockSalesOrders: SalesOrderRecord[] = [
  {
    orderId: 8001,
    orderCode: "SO-2025-00090",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    customerName: "코리아 모터스",
    status: "PENDING",
    requestedDate: "2025-01-05",
    items: [
      {
        partId: 1001,
        partCode: "ENG-FUEL-001",
        partName: "고압 연료 펌프",
        quantity: 30,
        unit: "EA",
      },
      {
        partId: 3001,
        partCode: "ELE-SENSOR-003",
        partName: "ABS 휠 속도 센서",
        quantity: 50,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8002,
    orderCode: "SO-2025-00091",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    customerName: "한빛 기전",
    status: "SHIPPING",
    requestedDate: "2025-01-04",
    items: [
      {
        partId: 2002,
        partCode: "CHS-BRAKE-008",
        partName: "세라믹 브레이크 패드",
        quantity: 20,
        unit: "SET",
      },
    ],
  },
  {
    orderId: 8003,
    orderCode: "SO-2025-00092",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    customerName: "서진 오토",
    status: "COMPLETED",
    requestedDate: "2024-12-28",
    completedDate: "2025-01-02",
    items: [
      {
        partId: 1002,
        partCode: "ENG-BLOCK-010",
        partName: "알루미늄 엔진 블록",
        quantity: 8,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8004,
    orderCode: "SO-2025-00093",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    customerName: "동아 부품",
    status: "PENDING",
    requestedDate: "2025-01-06",
    items: [
      {
        partId: 2001,
        partCode: "CHS-SUS-005",
        partName: "후륜 서스펜션 스프링",
        quantity: 20,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8005,
    orderCode: "SO-2025-00094",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    customerName: "대한 자동차 부품",
    status: "CONFIRMED",
    requestedDate: "2025-01-07",
    items: [
      {
        partId: 1003,
        partCode: "ENG-FUEL-002",
        partName: "연료 인젝터",
        quantity: 35,
        unit: "EA",
      },
      {
        partId: 1006,
        partCode: "ENG-FUEL-003",
        partName: "연료 필터",
        quantity: 50,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8006,
    orderCode: "SO-2025-00095",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    customerName: "태양 전자 부품",
    status: "SHIPPING",
    requestedDate: "2025-01-05",
    items: [
      {
        partId: 3002,
        partCode: "ELE-SENSOR-010",
        partName: "배기가스 온도 센서",
        quantity: 40,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8007,
    orderCode: "SO-2025-00096",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    customerName: "한국 섀시 시스템",
    status: "COMPLETED",
    requestedDate: "2024-12-30",
    completedDate: "2025-01-03",
    items: [
      {
        partId: 2003,
        partCode: "CHS-SUS-006",
        partName: "전륜 서스펜션 스프링",
        quantity: 25,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8008,
    orderCode: "SO-2025-00097",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    customerName: "프리미엄 모터스",
    status: "PENDING",
    requestedDate: "2025-01-08",
    items: [
      {
        partId: 1004,
        partCode: "ENG-BLOCK-011",
        partName: "크랭크샤프트",
        quantity: 10,
        unit: "EA",
      },
      {
        partId: 1005,
        partCode: "ENG-COOL-001",
        partName: "워터펌프",
        quantity: 20,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8009,
    orderCode: "SO-2025-00098",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    customerName: "글로벌 파워트레인",
    status: "CONFIRMED",
    requestedDate: "2025-01-09",
    items: [
      {
        partId: 2004,
        partCode: "CHS-BRAKE-009",
        partName: "브레이크 디스크",
        quantity: 18,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8010,
    orderCode: "SO-2025-00099",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    customerName: "스마트 브레이크",
    status: "SHIPPING",
    requestedDate: "2025-01-04",
    items: [
      {
        partId: 2005,
        partCode: "CHS-STEER-013",
        partName: "파워 스티어링 펌프",
        quantity: 12,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8011,
    orderCode: "SO-2025-00100",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    customerName: "아시아 센서",
    status: "COMPLETED",
    requestedDate: "2024-12-29",
    completedDate: "2025-01-04",
    items: [
      {
        partId: 3003,
        partCode: "ELE-SENSOR-011",
        partName: "산소 센서",
        quantity: 30,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8012,
    orderCode: "SO-2025-00101",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    customerName: "파워 엔지니어링",
    status: "PENDING",
    requestedDate: "2025-01-10",
    items: [
      {
        partId: 3004,
        partCode: "ELE-ECU-001",
        partName: "엔진 제어 모듈",
        quantity: 8,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8013,
    orderCode: "SO-2025-00102",
    warehouseId: 202,
    warehouseName: "대구 물류센터",
    customerName: "모던 오토파츠",
    status: "CONFIRMED",
    requestedDate: "2025-01-11",
    items: [
      {
        partId: 4001,
        partCode: "COOL-RAD-001",
        partName: "알루미늄 라디에이터",
        quantity: 15,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8014,
    orderCode: "SO-2025-00103",
    warehouseId: 203,
    warehouseName: "부산 항만 창고",
    customerName: "유니버설 메탈",
    status: "SHIPPING",
    requestedDate: "2025-01-06",
    items: [
      {
        partId: 5001,
        partCode: "EXH-MAN-001",
        partName: "배기 매니폴드",
        quantity: 10,
        unit: "EA",
      },
    ],
  },
  {
    orderId: 8015,
    orderCode: "SO-2025-00104",
    warehouseId: 201,
    warehouseName: "인천 물류센터",
    customerName: "코리아 모터스",
    status: "COMPLETED",
    requestedDate: "2024-12-31",
    completedDate: "2025-01-05",
    items: [
      {
        partId: 2006,
        partCode: "CHS-SUS-007",
        partName: "쇼크 업소버",
        quantity: 22,
        unit: "EA",
      },
      {
        partId: 2007,
        partCode: "CHS-BRAKE-010",
        partName: "브레이크 캘리퍼",
        quantity: 16,
        unit: "EA",
      },
    ],
  },
];

// customerName을 agencyId로 매핑 (간단한 해시 기반)
const getAgencyId = (customerName: string): number => {
  const agencyMap: Record<string, number> = {
    "코리아 모터스": 501,
    "한빛 기전": 502,
    "서진 오토": 503,
    "동아 부품": 504,
    "대한 자동차 부품": 505,
    "태양 전자 부품": 506,
    "한국 섀시 시스템": 507,
    "프리미엄 모터스": 508,
    "글로벌 파워트레인": 509,
    "스마트 브레이크": 510,
    "아시아 센서": 511,
    "파워 엔지니어링": 512,
    "모던 오토파츠": 513,
    "유니버설 메탈": 514,
  };
  return agencyMap[customerName] || 500 + (customerName.length % 100);
};

// SalesOrderRecord를 OrderResDto로 변환
export const transformToOrderResDto = (
  record: SalesOrderRecord,
): OrderResDto => {
  return {
    orderId: record.orderId,
    orderNumber: record.orderCode,
    agencyId: getAgencyId(record.customerName),
    agencyName: record.customerName,
    status: record.status,
    createdAt: record.requestedDate
      ? `${record.requestedDate}T00:00:00+09:00`
      : undefined,
    items: transformItems(record.items),
  };
};

// 변환된 OrderResDto 배열 (handlers에서 사용)
export const mockSalesOrdersDto: OrderResDto[] = mockSalesOrders.map(
  transformToOrderResDto,
);
