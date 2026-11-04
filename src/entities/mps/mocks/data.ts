export type MpsPartInfo = {
  partId: number;
  partCode: string;
  partName: string;
  unit: string;
  safetyStock: number;
};

export type MpsDetail = {
  mpsId: number;
  warehouseId: number;
  targetDate: string;
  forecastQuantity: number;
  totalProduction: number;
  expectedInventory: number;
  safetyStock: number;
  status: "PLANNED" | "PROCESSING" | "COMPLETED";
  standardQuantity: number;
  leadTime: number;
};

export type MpsPlanResult = {
  mpsPlanId: number;
  mpsId: number;
  cycleNumber: number;
  productionQuantity: number;
  remainingTotalProduction: number;
  requiredDate: string;
  createdAt: string;
  // MPS 자체와 달리 계획 상태는 v1 MpsPlanResponse 값을 쓴다
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "DELAYED" | "CANCELLED";
};

export type PartOrderResult = {
  orderId: number;
  orderCode: string;
  warehouseId: number;
  warehouseName: string;
  orderDate: string;
  requiredDate: string;
  status:
    | "UNDER_REVIEW"
    | "PURCHASE_REQUEST"
    | "PLAN_CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED";
  materialAvailability: "SUFFICIENT" | "INSUFFICIENT";
};

export const mockMpsPartsByFactory: Record<number, MpsPartInfo[]> = {
  101: [
    {
      partId: 1001,
      partCode: "ENG-FUEL-001",
      partName: "고압 연료 펌프",
      unit: "EA",
      safetyStock: 120,
    },
    {
      partId: 1002,
      partCode: "ENG-BLOCK-010",
      partName: "알루미늄 엔진 블록",
      unit: "EA",
      safetyStock: 40,
    },
    {
      partId: 1003,
      partCode: "ENG-TURBO-005",
      partName: "터보차저 압축기",
      unit: "EA",
      safetyStock: 60,
    },
    {
      partId: 1004,
      partCode: "ENG-BLOCK-011",
      partName: "크랭크샤프트",
      unit: "EA",
      safetyStock: 30,
    },
    {
      partId: 1005,
      partCode: "ENG-COOL-001",
      partName: "워터펌프",
      unit: "EA",
      safetyStock: 90,
    },
  ],
  102: [
    {
      partId: 2001,
      partCode: "CHS-SUS-005",
      partName: "후륜 서스펜션 스프링",
      unit: "EA",
      safetyStock: 200,
    },
    {
      partId: 2002,
      partCode: "CHS-BRAKE-008",
      partName: "세라믹 브레이크 패드",
      unit: "SET",
      safetyStock: 80,
    },
    {
      partId: 2003,
      partCode: "CHS-STEER-012",
      partName: "전동 파워 스티어링",
      unit: "EA",
      safetyStock: 100,
    },
    {
      partId: 2004,
      partCode: "CHS-BRAKE-009",
      partName: "브레이크 디스크",
      unit: "EA",
      safetyStock: 150,
    },
    {
      partId: 2005,
      partCode: "CHS-STEER-013",
      partName: "파워 스티어링 펌프",
      unit: "EA",
      safetyStock: 70,
    },
  ],
  104: [
    {
      partId: 3001,
      partCode: "ELE-SENSOR-003",
      partName: "ABS 휠 속도 센서",
      unit: "EA",
      safetyStock: 180,
    },
    {
      partId: 3002,
      partCode: "ELE-SENSOR-010",
      partName: "배기가스 온도 센서",
      unit: "EA",
      safetyStock: 110,
    },
  ],
};

export const mockForecastMonths: Record<string, string[]> = {
  "101-1001": ["2026-10-23", "2026-11-23", "2026-12-21", "2027-01-21"],
  "101-1002": ["2026-10-23", "2026-11-06", "2026-12-07", "2027-01-04"],
  "101-1003": ["2026-10-23", "2026-11-23"],
  "101-1004": ["2026-11-01", "2026-12-02", "2026-12-30"],
  "101-1005": ["2026-10-27", "2026-11-27", "2026-12-25", "2027-01-25"],
  "102-2001": ["2026-11-23", "2026-12-21", "2027-01-21"],
  "102-2002": ["2026-10-23", "2027-01-21", "2027-02-20"],
  "102-2003": ["2026-10-23", "2026-11-23", "2026-12-21"],
  "102-2004": ["2026-11-11", "2026-12-12", "2027-01-09"],
  "102-2005": ["2026-11-06", "2027-01-04", "2027-02-04"],
  "104-3001": [
    "2026-10-23",
    "2026-11-23",
    "2026-12-21",
    "2027-01-21",
    "2027-02-20",
  ],
  "104-3002": ["2026-11-01", "2026-12-02", "2026-12-30"],
};

export const mockMpsDetails: Record<string, MpsDetail> = {
  "101-201": {
    mpsId: 90001,
    warehouseId: 201,
    targetDate: "2026-11-11",
    forecastQuantity: 320,
    totalProduction: 340,
    expectedInventory: 150,
    safetyStock: 120,
    status: "PROCESSING",
    standardQuantity: 80,
    leadTime: 3,
  },
  "101-202": {
    mpsId: 90002,
    warehouseId: 202,
    targetDate: "2026-11-09",
    forecastQuantity: 280,
    totalProduction: 300,
    expectedInventory: 110,
    safetyStock: 120,
    status: "PLANNED",
    standardQuantity: 75,
    leadTime: 4,
  },
  "101-203": {
    mpsId: 90003,
    warehouseId: 203,
    targetDate: "2026-11-16",
    forecastQuantity: 250,
    totalProduction: 280,
    expectedInventory: 95,
    safetyStock: 120,
    status: "PLANNED",
    standardQuantity: 70,
    leadTime: 5,
  },
  "102-201": {
    mpsId: 91001,
    warehouseId: 201,
    targetDate: "2026-11-27",
    forecastQuantity: 180,
    totalProduction: 200,
    expectedInventory: 90,
    safetyStock: 150,
    status: "COMPLETED",
    standardQuantity: 60,
    leadTime: 2,
  },
  "102-202": {
    mpsId: 91002,
    warehouseId: 202,
    targetDate: "2026-12-02",
    forecastQuantity: 220,
    totalProduction: 240,
    expectedInventory: 120,
    safetyStock: 150,
    status: "PROCESSING",
    standardQuantity: 65,
    leadTime: 3,
  },
  "101-204": {
    mpsId: 90004,
    warehouseId: 201,
    targetDate: "2026-11-19",
    forecastQuantity: 180,
    totalProduction: 200,
    expectedInventory: 85,
    safetyStock: 30,
    status: "PLANNED",
    standardQuantity: 50,
    leadTime: 4,
  },
  "101-205": {
    mpsId: 90005,
    warehouseId: 203,
    targetDate: "2026-11-27",
    forecastQuantity: 250,
    totalProduction: 280,
    expectedInventory: 100,
    safetyStock: 90,
    status: "PLANNED",
    standardQuantity: 70,
    leadTime: 2,
  },
  "102-204": {
    mpsId: 91003,
    warehouseId: 201,
    targetDate: "2026-12-07",
    forecastQuantity: 160,
    totalProduction: 180,
    expectedInventory: 75,
    safetyStock: 150,
    status: "PLANNED",
    standardQuantity: 45,
    leadTime: 3,
  },
  "102-205": {
    mpsId: 91004,
    warehouseId: 202,
    targetDate: "2026-12-12",
    forecastQuantity: 140,
    totalProduction: 160,
    expectedInventory: 65,
    safetyStock: 70,
    status: "PROCESSING",
    standardQuantity: 40,
    leadTime: 2,
  },
  "104-3001": {
    mpsId: 92001,
    warehouseId: 201,
    targetDate: "2026-11-23",
    forecastQuantity: 300,
    totalProduction: 320,
    expectedInventory: 140,
    safetyStock: 180,
    status: "PROCESSING",
    standardQuantity: 80,
    leadTime: 3,
  },
  "104-3002": {
    mpsId: 92002,
    warehouseId: 202,
    targetDate: "2026-11-30",
    forecastQuantity: 270,
    totalProduction: 290,
    expectedInventory: 125,
    safetyStock: 110,
    status: "PLANNED",
    standardQuantity: 72,
    leadTime: 4,
  },
};

export const mockMpsPlanResults: Record<number, MpsPlanResult[]> = {
  90001: [
    {
      mpsPlanId: 50001,
      mpsId: 90001,
      cycleNumber: 1,
      productionQuantity: 120,
      remainingTotalProduction: 220,
      requiredDate: "2026-11-03",
      createdAt: "2026-10-11T09:00:00+09:00",
      status: "COMPLETED",
    },
    {
      mpsPlanId: 50002,
      mpsId: 90001,
      cycleNumber: 2,
      productionQuantity: 110,
      remainingTotalProduction: 110,
      requiredDate: "2026-11-06",
      createdAt: "2026-10-13T09:00:00+09:00",
      status: "IN_PROGRESS",
    },
    {
      mpsPlanId: 50003,
      mpsId: 90001,
      cycleNumber: 3,
      productionQuantity: 110,
      remainingTotalProduction: 0,
      requiredDate: "2026-11-09",
      createdAt: "2026-10-15T09:00:00+09:00",
      status: "PLANNED",
    },
  ],
  90002: [
    {
      mpsPlanId: 50011,
      mpsId: 90002,
      cycleNumber: 1,
      productionQuantity: 100,
      remainingTotalProduction: 200,
      requiredDate: "2026-11-01",
      createdAt: "2026-10-09T09:00:00+09:00",
      status: "PLANNED",
    },
    {
      mpsPlanId: 50012,
      mpsId: 90002,
      cycleNumber: 2,
      productionQuantity: 100,
      remainingTotalProduction: 100,
      requiredDate: "2026-11-05",
      createdAt: "2026-10-11T09:00:00+09:00",
      status: "PLANNED",
    },
  ],
  91001: [
    {
      mpsPlanId: 51001,
      mpsId: 91001,
      cycleNumber: 1,
      productionQuantity: 100,
      remainingTotalProduction: 100,
      requiredDate: "2026-11-21",
      createdAt: "2026-10-06T09:00:00+09:00",
      status: "COMPLETED",
    },
    {
      mpsPlanId: 51002,
      mpsId: 91001,
      cycleNumber: 2,
      productionQuantity: 100,
      remainingTotalProduction: 0,
      requiredDate: "2026-11-25",
      createdAt: "2026-10-08T09:00:00+09:00",
      status: "COMPLETED",
    },
  ],
  90004: [
    {
      mpsPlanId: 50021,
      mpsId: 90004,
      cycleNumber: 1,
      productionQuantity: 70,
      remainingTotalProduction: 130,
      requiredDate: "2026-11-11",
      createdAt: "2026-10-19T09:00:00+09:00",
      status: "PLANNED",
    },
    {
      mpsPlanId: 50022,
      mpsId: 90004,
      cycleNumber: 2,
      productionQuantity: 65,
      remainingTotalProduction: 65,
      requiredDate: "2026-11-15",
      createdAt: "2026-10-21T09:00:00+09:00",
      status: "PLANNED",
    },
  ],
  92001: [
    {
      mpsPlanId: 52001,
      mpsId: 92001,
      cycleNumber: 1,
      productionQuantity: 110,
      remainingTotalProduction: 210,
      requiredDate: "2026-11-16",
      createdAt: "2026-10-13T09:00:00+09:00",
      status: "IN_PROGRESS",
    },
    {
      mpsPlanId: 52002,
      mpsId: 92001,
      cycleNumber: 2,
      productionQuantity: 105,
      remainingTotalProduction: 105,
      requiredDate: "2026-11-19",
      createdAt: "2026-10-15T09:00:00+09:00",
      status: "PLANNED",
    },
  ],
};

export const mockPartOrderResults: Record<number, PartOrderResult[]> = {
  90001: [
    {
      orderId: 70001,
      orderCode: "PO-2026-0001",
      warehouseId: 201,
      warehouseName: "인천 물류센터",
      orderDate: "2026-10-17T10:00:00+09:00",
      requiredDate: "2026-10-27T10:00:00+09:00",
      status: "PLAN_CONFIRMED",
      materialAvailability: "SUFFICIENT",
    },
    {
      orderId: 70002,
      orderCode: "PO-2026-0002",
      warehouseId: 202,
      warehouseName: "대구 물류센터",
      orderDate: "2026-10-19T14:00:00+09:00",
      requiredDate: "2026-10-30T10:00:00+09:00",
      status: "IN_PROGRESS",
      materialAvailability: "INSUFFICIENT",
    },
  ],
  90002: [
    {
      orderId: 70011,
      orderCode: "PO-2026-0011",
      warehouseId: 202,
      warehouseName: "대구 물류센터",
      orderDate: "2026-10-16T09:00:00+09:00",
      requiredDate: "2026-11-03T10:00:00+09:00",
      status: "UNDER_REVIEW",
      materialAvailability: "SUFFICIENT",
    },
  ],
  91001: [
    {
      orderId: 71001,
      orderCode: "PO-2026-0021",
      warehouseId: 201,
      warehouseName: "인천 물류센터",
      orderDate: "2026-10-11T10:00:00+09:00",
      requiredDate: "2026-11-21T10:00:00+09:00",
      status: "COMPLETED",
      materialAvailability: "SUFFICIENT",
    },
  ],
  90004: [
    {
      orderId: 70021,
      orderCode: "PO-2026-0031",
      warehouseId: 201,
      warehouseName: "인천 물류센터",
      orderDate: "2026-10-20T10:00:00+09:00",
      requiredDate: "2026-11-09T10:00:00+09:00",
      status: "UNDER_REVIEW",
      materialAvailability: "SUFFICIENT",
    },
  ],
  92001: [
    {
      orderId: 72001,
      orderCode: "PO-2026-0041",
      warehouseId: 201,
      warehouseName: "인천 물류센터",
      orderDate: "2026-10-14T10:00:00+09:00",
      requiredDate: "2026-11-14T10:00:00+09:00",
      status: "PLAN_CONFIRMED",
      materialAvailability: "INSUFFICIENT",
    },
    {
      orderId: 72002,
      orderCode: "PO-2026-0042",
      warehouseId: 202,
      warehouseName: "대구 물류센터",
      orderDate: "2026-10-16T10:00:00+09:00",
      requiredDate: "2026-11-17T10:00:00+09:00",
      status: "IN_PROGRESS",
      materialAvailability: "SUFFICIENT",
    },
  ],
};
