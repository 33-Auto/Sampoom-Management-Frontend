import type { Schemas } from "@/shared/model";export type ShippingOrderDto = Schemas["OrderWithStockDto"];
export type ShippingOrderItemDto = Schemas["PartStockDto"];

// 레거시 타입 (내부 사용)
export type ShippingListItem = {
  orderId: number;
  warehouseId: number;
  orderNumber: string;
  agencyName: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPING"
    | "DELIVERING"
    | "ARRIVED"
    | "COMPLETED"
    | "DELAYED"
    | "CANCELED"
    | "SHIPPED";
  categoryId?: number;
  groupId?: number;
  items: Array<{
    partId: number;
    partCode: string;
    partName: string;
    orderQuantity: number;
    stock: number;
  }>;
};

// 부품 코드를 기반으로 카테고리와 그룹 매핑
const getCategoryAndGroup = (
  partCode: string,
): {
  categoryId: number;
  groupId: number;
  categoryName: string;
  groupName: string;
} => {
  if (partCode.startsWith("ENG-FUEL-"))
    return {
      categoryId: 1,
      groupId: 11,
      categoryName: "엔진 부품",
      groupName: "연료 공급",
    };
  if (partCode.startsWith("ENG-BLOCK-"))
    return {
      categoryId: 1,
      groupId: 12,
      categoryName: "엔진 부품",
      groupName: "엔진 블록",
    };
  if (partCode.startsWith("ENG-COOL-"))
    return {
      categoryId: 1,
      groupId: 13,
      categoryName: "엔진 부품",
      groupName: "냉각 시스템",
    };
  if (partCode.startsWith("CHS-SUS-"))
    return {
      categoryId: 2,
      groupId: 21,
      categoryName: "섀시 부품",
      groupName: "현가 장치",
    };
  if (partCode.startsWith("CHS-BRAKE-"))
    return {
      categoryId: 2,
      groupId: 22,
      categoryName: "섀시 부품",
      groupName: "제동 장치",
    };
  if (partCode.startsWith("CHS-STEER-"))
    return {
      categoryId: 2,
      groupId: 23,
      categoryName: "섀시 부품",
      groupName: "스티어링",
    };
  if (partCode.startsWith("ELE-SENSOR-"))
    return {
      categoryId: 3,
      groupId: 31,
      categoryName: "전자 부품",
      groupName: "센서 모듈",
    };
  if (partCode.startsWith("ELE-ECU-"))
    return {
      categoryId: 3,
      groupId: 32,
      categoryName: "전자 부품",
      groupName: "제어 모듈",
    };
  if (partCode.startsWith("ELE-TCU-"))
    return {
      categoryId: 3,
      groupId: 32,
      categoryName: "전자 부품",
      groupName: "제어 모듈",
    };
  if (partCode.startsWith("COOL-RAD-"))
    return {
      categoryId: 4,
      groupId: 41,
      categoryName: "냉각 시스템",
      groupName: "라디에이터",
    };
  if (partCode.startsWith("EXH-MAN-"))
    return {
      categoryId: 5,
      groupId: 51,
      categoryName: "배기 시스템",
      groupName: "배기 매니폴드",
    };
  // 기본값
  return {
    categoryId: 1,
    groupId: 11,
    categoryName: "엔진 부품",
    groupName: "연료 공급",
  };
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
    "ELE-SENSOR-012": 22000,
    "ELE-ECU-001": 800000,
    "ELE-TCU-001": 750000,
    "COOL-RAD-001": 150000,
    "EXH-MAN-001": 280000,
  };
  return costs[partCode] || 100000;
};

// ShippingListItem을 ShippingOrderDto로 변환
export const transformToShippingOrderDto = (
  item: ShippingListItem,
): ShippingOrderDto => {
  return {
    orderId: item.orderId,
    orderNumber: item.orderNumber,
    agencyName: item.agencyName,
    status: item.status,
    createdAt: new Date().toISOString(), // 기본값으로 현재 시간 사용
    items: item.items.map((item) => {
      const { categoryName, groupName } = getCategoryAndGroup(item.partCode);
      return {
        categoryName,
        groupName,
        partId: item.partId,
        name: item.partName,
        code: item.partCode,
        stock: item.stock,
        orderQuantity: item.orderQuantity,
        standardCost: getStandardCost(item.partCode),
      };
    }),
  };
};

export const mockShippingOrders: ShippingListItem[] = [
  {
    orderId: 6101,
    warehouseId: 201,
    orderNumber: "SO-2025-00045",
    agencyName: "코리아 모터스",
    status: "PENDING",
    categoryId: 1,
    groupId: 11,
    items: [
      {
        partId: 1001,
        partCode: "ENG-FUEL-001",
        partName: "고압 연료 펌프",
        orderQuantity: 40,
        stock: 60,
      },
      {
        partId: 3001,
        partCode: "ELE-SENSOR-003",
        partName: "ABS 휠 속도 센서",
        orderQuantity: 60,
        stock: 55,
      },
    ],
  },
  {
    orderId: 6102,
    warehouseId: 201,
    orderNumber: "SO-2025-00046",
    agencyName: "한빛 기전",
    status: "SHIPPING",
    categoryId: 2,
    groupId: 21,
    items: [
      {
        partId: 2001,
        partCode: "CHS-SUS-005",
        partName: "후륜 서스펜션 스프링",
        orderQuantity: 25,
        stock: 32,
      },
    ],
  },
  {
    orderId: 6103,
    warehouseId: 202,
    orderNumber: "SO-2025-00047",
    agencyName: "동아 부품",
    status: "DELAYED",
    categoryId: 3,
    groupId: 31,
    items: [
      {
        partId: 3002,
        partCode: "ELE-SENSOR-010",
        partName: "배기가스 온도 센서",
        orderQuantity: 80,
        stock: 40,
      },
    ],
  },
  {
    orderId: 6104,
    warehouseId: 203,
    orderNumber: "SO-2025-00048",
    agencyName: "서진 오토",
    status: "COMPLETED",
    categoryId: 1,
    groupId: 12,
    items: [
      {
        partId: 1002,
        partCode: "ENG-BLOCK-010",
        partName: "알루미늄 엔진 블록",
        orderQuantity: 10,
        stock: 10,
      },
    ],
  },
  {
    orderId: 6105,
    warehouseId: 203,
    orderNumber: "SO-2025-00049",
    agencyName: "프라임 딜러스",
    status: "DELIVERING",
    categoryId: 2,
    groupId: 22,
    items: [
      {
        partId: 2002,
        partCode: "CHS-BRAKE-008",
        partName: "세라믹 브레이크 패드",
        orderQuantity: 50,
        stock: 48,
      },
    ],
  },
  {
    orderId: 6106,
    warehouseId: 201,
    orderNumber: "SO-2025-00050",
    agencyName: "대한 자동차 부품",
    status: "PENDING",
    categoryId: 1,
    groupId: 11,
    items: [
      {
        partId: 1003,
        partCode: "ENG-FUEL-002",
        partName: "연료 인젝터",
        orderQuantity: 35,
        stock: 50,
      },
    ],
  },
  {
    orderId: 6107,
    warehouseId: 202,
    orderNumber: "SO-2025-00051",
    agencyName: "태양 전자 부품",
    status: "CONFIRMED",
    categoryId: 3,
    groupId: 31,
    items: [
      {
        partId: 3002,
        partCode: "ELE-SENSOR-010",
        partName: "배기가스 온도 센서",
        orderQuantity: 40,
        stock: 45,
      },
    ],
  },
  {
    orderId: 6108,
    warehouseId: 203,
    orderNumber: "SO-2025-00052",
    agencyName: "한국 섀시 시스템",
    status: "SHIPPING",
    categoryId: 2,
    groupId: 21,
    items: [
      {
        partId: 2003,
        partCode: "CHS-SUS-006",
        partName: "전륜 서스펜션 스프링",
        orderQuantity: 25,
        stock: 30,
      },
    ],
  },
  {
    orderId: 6109,
    warehouseId: 201,
    orderNumber: "SO-2025-00053",
    agencyName: "프리미엄 모터스",
    status: "PENDING",
    categoryId: 1,
    groupId: 12,
    items: [
      {
        partId: 1004,
        partCode: "ENG-BLOCK-011",
        partName: "크랭크샤프트",
        orderQuantity: 10,
        stock: 12,
      },
      {
        partId: 1005,
        partCode: "ENG-COOL-001",
        partName: "워터펌프",
        orderQuantity: 20,
        stock: 28,
      },
    ],
  },
  {
    orderId: 6110,
    warehouseId: 202,
    orderNumber: "SO-2025-00054",
    agencyName: "글로벌 파워트레인",
    status: "CONFIRMED",
    categoryId: 2,
    groupId: 22,
    items: [
      {
        partId: 2004,
        partCode: "CHS-BRAKE-009",
        partName: "브레이크 디스크",
        orderQuantity: 18,
        stock: 25,
      },
    ],
  },
  {
    orderId: 6111,
    warehouseId: 203,
    orderNumber: "SO-2025-00055",
    agencyName: "스마트 브레이크",
    status: "SHIPPING",
    categoryId: 2,
    groupId: 23,
    items: [
      {
        partId: 2005,
        partCode: "CHS-STEER-013",
        partName: "파워 스티어링 펌프",
        orderQuantity: 12,
        stock: 15,
      },
    ],
  },
  {
    orderId: 6112,
    warehouseId: 201,
    orderNumber: "SO-2025-00056",
    agencyName: "아시아 센서",
    status: "PENDING",
    categoryId: 3,
    groupId: 32,
    items: [
      {
        partId: 3004,
        partCode: "ELE-ECU-001",
        partName: "엔진 제어 모듈",
        orderQuantity: 8,
        stock: 10,
      },
    ],
  },
  {
    orderId: 6113,
    warehouseId: 202,
    orderNumber: "SO-2025-00057",
    agencyName: "파워 엔지니어링",
    status: "CONFIRMED",
    categoryId: 4,
    groupId: 41,
    items: [
      {
        partId: 4001,
        partCode: "COOL-RAD-001",
        partName: "알루미늄 라디에이터",
        orderQuantity: 15,
        stock: 20,
      },
    ],
  },
  {
    orderId: 6114,
    warehouseId: 203,
    orderNumber: "SO-2025-00058",
    agencyName: "모던 오토파츠",
    status: "SHIPPING",
    categoryId: 5,
    groupId: 51,
    items: [
      {
        partId: 5001,
        partCode: "EXH-MAN-001",
        partName: "배기 매니폴드",
        orderQuantity: 10,
        stock: 12,
      },
    ],
  },
  {
    orderId: 6115,
    warehouseId: 201,
    orderNumber: "SO-2025-00059",
    agencyName: "유니버설 메탈",
    status: "DELIVERING",
    categoryId: 1,
    groupId: 11,
    items: [
      {
        partId: 1006,
        partCode: "ENG-FUEL-003",
        partName: "연료 필터",
        orderQuantity: 50,
        stock: 65,
      },
    ],
  },
  {
    orderId: 6116,
    warehouseId: 202,
    orderNumber: "SO-2025-00060",
    agencyName: "코리아 모터스",
    status: "ARRIVED",
    categoryId: 2,
    groupId: 21,
    items: [
      {
        partId: 2006,
        partCode: "CHS-SUS-007",
        partName: "쇼크 업소버",
        orderQuantity: 22,
        stock: 28,
      },
    ],
  },
  {
    orderId: 6117,
    warehouseId: 203,
    orderNumber: "SO-2025-00061",
    agencyName: "한빛 기전",
    status: "COMPLETED",
    categoryId: 2,
    groupId: 22,
    items: [
      {
        partId: 2007,
        partCode: "CHS-BRAKE-010",
        partName: "브레이크 캘리퍼",
        orderQuantity: 16,
        stock: 20,
      },
    ],
  },
  {
    orderId: 6118,
    warehouseId: 201,
    orderNumber: "SO-2025-00062",
    agencyName: "동아 부품",
    status: "DELAYED",
    categoryId: 3,
    groupId: 31,
    items: [
      {
        partId: 3005,
        partCode: "ELE-SENSOR-012",
        partName: "압력 센서",
        orderQuantity: 30,
        stock: 25,
      },
    ],
  },
  {
    orderId: 6119,
    warehouseId: 202,
    orderNumber: "SO-2025-00063",
    agencyName: "서진 오토",
    status: "CANCELED",
    categoryId: 3,
    groupId: 32,
    items: [
      {
        partId: 3006,
        partCode: "ELE-TCU-001",
        partName: "변속기 제어 모듈",
        orderQuantity: 5,
        stock: 8,
      },
    ],
  },
  {
    orderId: 6120,
    warehouseId: 203,
    orderNumber: "SO-2025-00064",
    agencyName: "대한 자동차 부품",
    status: "PENDING",
    categoryId: 1,
    groupId: 13,
    items: [
      {
        partId: 1005,
        partCode: "ENG-COOL-001",
        partName: "워터펌프",
        orderQuantity: 25,
        stock: 32,
      },
    ],
  },
];
