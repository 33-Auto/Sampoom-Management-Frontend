export type ShippingOrderItem = {
  partId: number;
  partCode: string;
  partName: string;
  orderQuantity: number;
  availableStock: number;
};

export type ShippingOrder = {
  orderId: number;
  warehouseId: number;
  orderNumber: string;
  agencyName: string;
  status: "PENDING" | "SHIPPED" | "PARTIAL";
  items: ShippingOrderItem[];
};

export const mockShippingOrders: ShippingOrder[] = [
  {
    orderId: 6101,
    warehouseId: 201,
    orderNumber: "SO-2025-00045",
    agencyName: "코리아 모터스",
    status: "PENDING",
    items: [
      {
        partId: 1001,
        partCode: "ENG-FUEL-001",
        partName: "고압 연료 펌프",
        orderQuantity: 40,
        availableStock: 60,
      },
      {
        partId: 3001,
        partCode: "ELE-SENSOR-003",
        partName: "ABS 휠 속도 센서",
        orderQuantity: 80,
        availableStock: 50,
      },
    ],
  },
  {
    orderId: 6102,
    warehouseId: 202,
    orderNumber: "SO-2025-00046",
    agencyName: "한빛 기전",
    status: "PENDING",
    items: [
      {
        partId: 2002,
        partCode: "CHS-BRAKE-008",
        partName: "세라믹 브레이크 패드",
        orderQuantity: 30,
        availableStock: 45,
      },
    ],
  },
  {
    orderId: 6103,
    warehouseId: 201,
    orderNumber: "SO-2025-00047",
    agencyName: "동아 부품",
    status: "PENDING",
    items: [
      {
        partId: 1002,
        partCode: "ENG-BLOCK-010",
        partName: "알루미늄 엔진 블록",
        orderQuantity: 15,
        availableStock: 25,
      },
      {
        partId: 3001,
        partCode: "ELE-SENSOR-003",
        partName: "ABS 휠 속도 센서",
        orderQuantity: 50,
        availableStock: 60,
      },
    ],
  },
  {
    orderId: 6104,
    warehouseId: 203,
    orderNumber: "SO-2025-00048",
    agencyName: "서진 오토",
    status: "PENDING",
    items: [
      {
        partId: 2001,
        partCode: "CHS-SUS-005",
        partName: "후륜 서스펜션 스프링",
        orderQuantity: 20,
        availableStock: 35,
      },
    ],
  },
  {
    orderId: 6105,
    warehouseId: 201,
    orderNumber: "SO-2025-00049",
    agencyName: "대한 자동차 부품",
    status: "PENDING",
    items: [
      {
        partId: 1003,
        partCode: "ENG-FUEL-002",
        partName: "연료 인젝터",
        orderQuantity: 35,
        availableStock: 50,
      },
    ],
  },
  {
    orderId: 6106,
    warehouseId: 202,
    orderNumber: "SO-2025-00050",
    agencyName: "태양 전자 부품",
    status: "PENDING",
    items: [
      {
        partId: 3002,
        partCode: "ELE-SENSOR-010",
        partName: "배기가스 온도 센서",
        orderQuantity: 40,
        availableStock: 45,
      },
      {
        partId: 3003,
        partCode: "ELE-SENSOR-011",
        partName: "산소 센서",
        orderQuantity: 30,
        availableStock: 40,
      },
    ],
  },
  {
    orderId: 6107,
    warehouseId: 203,
    orderNumber: "SO-2025-00051",
    agencyName: "한국 섀시 시스템",
    status: "PENDING",
    items: [
      {
        partId: 2003,
        partCode: "CHS-SUS-006",
        partName: "전륜 서스펜션 스프링",
        orderQuantity: 25,
        availableStock: 30,
      },
    ],
  },
  {
    orderId: 6108,
    warehouseId: 201,
    orderNumber: "SO-2025-00052",
    agencyName: "프리미엄 모터스",
    status: "PENDING",
    items: [
      {
        partId: 1004,
        partCode: "ENG-BLOCK-011",
        partName: "크랭크샤프트",
        orderQuantity: 10,
        availableStock: 12,
      },
      {
        partId: 1005,
        partCode: "ENG-COOL-001",
        partName: "워터펌프",
        orderQuantity: 20,
        availableStock: 28,
      },
    ],
  },
  {
    orderId: 6109,
    warehouseId: 202,
    orderNumber: "SO-2025-00053",
    agencyName: "글로벌 파워트레인",
    status: "PENDING",
    items: [
      {
        partId: 2004,
        partCode: "CHS-BRAKE-009",
        partName: "브레이크 디스크",
        orderQuantity: 18,
        availableStock: 25,
      },
    ],
  },
  {
    orderId: 6110,
    warehouseId: 203,
    orderNumber: "SO-2025-00054",
    agencyName: "스마트 브레이크",
    status: "PENDING",
    items: [
      {
        partId: 2005,
        partCode: "CHS-STEER-013",
        partName: "파워 스티어링 펌프",
        orderQuantity: 12,
        availableStock: 15,
      },
    ],
  },
  {
    orderId: 6111,
    warehouseId: 201,
    orderNumber: "SO-2025-00055",
    agencyName: "아시아 센서",
    status: "PENDING",
    items: [
      {
        partId: 3004,
        partCode: "ELE-ECU-001",
        partName: "엔진 제어 모듈",
        orderQuantity: 8,
        availableStock: 10,
      },
    ],
  },
  {
    orderId: 6112,
    warehouseId: 202,
    orderNumber: "SO-2025-00056",
    agencyName: "파워 엔지니어링",
    status: "PENDING",
    items: [
      {
        partId: 4001,
        partCode: "COOL-RAD-001",
        partName: "알루미늄 라디에이터",
        orderQuantity: 15,
        availableStock: 20,
      },
    ],
  },
  {
    orderId: 6113,
    warehouseId: 203,
    orderNumber: "SO-2025-00057",
    agencyName: "모던 오토파츠",
    status: "PENDING",
    items: [
      {
        partId: 5001,
        partCode: "EXH-MAN-001",
        partName: "배기 매니폴드",
        orderQuantity: 10,
        availableStock: 12,
      },
    ],
  },
  {
    orderId: 6114,
    warehouseId: 201,
    orderNumber: "SO-2025-00058",
    agencyName: "유니버설 메탈",
    status: "PENDING",
    items: [
      {
        partId: 1006,
        partCode: "ENG-FUEL-003",
        partName: "연료 필터",
        orderQuantity: 50,
        availableStock: 65,
      },
    ],
  },
  {
    orderId: 6115,
    warehouseId: 202,
    orderNumber: "SO-2025-00059",
    agencyName: "코리아 모터스",
    status: "PENDING",
    items: [
      {
        partId: 2006,
        partCode: "CHS-SUS-007",
        partName: "쇼크 업소버",
        orderQuantity: 22,
        availableStock: 28,
      },
      {
        partId: 2007,
        partCode: "CHS-BRAKE-010",
        partName: "브레이크 캘리퍼",
        orderQuantity: 16,
        availableStock: 20,
      },
    ],
  },
];
