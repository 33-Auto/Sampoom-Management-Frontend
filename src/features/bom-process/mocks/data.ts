export type MockBomMaterial = {
  partId: number;
  partCode: string;
  partName: string;
  quantity: number;
  unit: string;
  scrapRate: number;
};

export type MockBomDetail = {
  bomId: number;
  bomName: string;
  version: string;
  status: "ACTIVE" | "REVIEWING" | "INACTIVE";
  complexity: "SIMPLE" | "NORMAL" | "COMPLEX";
  description?: string;
  createdAt: string;
  updatedAt: string;
  materials: MockBomMaterial[];
};

export const mockBomDetails: MockBomDetail[] = [
  {
    bomId: 1,
    bomName: "엔진 어셈블리 A-Type",
    version: "v2.1",
    status: "ACTIVE",
    complexity: "COMPLEX",
    description: "고성능 엔진 어셈블리 (2025년형)",
    createdAt: "2024-12-15T09:00:00+09:00",
    updatedAt: "2024-12-20T09:00:00+09:00",
    materials: [
      {
        partId: 1001,
        partCode: "ENG-FUEL-001",
        partName: "고압 연료 펌프",
        quantity: 2,
        unit: "EA",
        scrapRate: 0.02,
      },
      {
        partId: 3001,
        partCode: "ELE-SENSOR-003",
        partName: "ABS 휠 속도 센서",
        quantity: 4,
        unit: "EA",
        scrapRate: 0.05,
      },
    ],
  },
  {
    bomId: 2,
    bomName: "브레이크 시스템 B-Type",
    version: "v1.4",
    status: "REVIEWING",
    complexity: "NORMAL",
    description: "경량화 브레이크 시스템",
    createdAt: "2024-11-10T09:00:00+09:00",
    updatedAt: "2024-12-01T09:00:00+09:00",
    materials: [
      {
        partId: 2002,
        partCode: "CHS-BRAKE-008",
        partName: "세라믹 브레이크 패드",
        quantity: 4,
        unit: "SET",
        scrapRate: 0.01,
      },
      {
        partId: 3002,
        partCode: "ELE-SENSOR-010",
        partName: "배기가스 온도 센서",
        quantity: 2,
        unit: "EA",
        scrapRate: 0.03,
      },
    ],
  },
  {
    bomId: 3,
    bomName: "서스펜션 모듈 C-Type",
    version: "v2.0",
    status: "ACTIVE",
    complexity: "NORMAL",
    description: "프리미엄 서스펜션 시스템",
    createdAt: "2024-12-05T09:00:00+09:00",
    updatedAt: "2024-12-20T09:00:00+09:00",
    materials: [
      {
        partId: 2001,
        partCode: "CHS-SUS-005",
        partName: "후륜 서스펜션 스프링",
        quantity: 4,
        unit: "EA",
        scrapRate: 0.02,
      },
      {
        partId: 2003,
        partCode: "CHS-SUS-006",
        partName: "전륜 서스펜션 스프링",
        quantity: 4,
        unit: "EA",
        scrapRate: 0.02,
      },
    ],
  },
  {
    bomId: 4,
    bomName: "냉각 시스템 D-Type",
    version: "v1.2",
    status: "ACTIVE",
    complexity: "SIMPLE",
    description: "고효율 냉각 시스템",
    createdAt: "2024-11-20T09:00:00+09:00",
    updatedAt: "2024-12-15T09:00:00+09:00",
    materials: [
      {
        partId: 4001,
        partCode: "COOL-RAD-001",
        partName: "알루미늄 라디에이터",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.01,
      },
      {
        partId: 1005,
        partCode: "ENG-COOL-001",
        partName: "워터펌프",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.01,
      },
    ],
  },
  {
    bomId: 5,
    bomName: "배기 시스템 E-Type",
    version: "v1.5",
    status: "ACTIVE",
    complexity: "NORMAL",
    description: "저소음 배기 시스템",
    createdAt: "2024-12-01T09:00:00+09:00",
    updatedAt: "2024-12-18T09:00:00+09:00",
    materials: [
      {
        partId: 5001,
        partCode: "EXH-MAN-001",
        partName: "배기 매니폴드",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.01,
      },
      {
        partId: 3002,
        partCode: "ELE-SENSOR-010",
        partName: "배기가스 온도 센서",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.02,
      },
    ],
  },
  {
    bomId: 6,
    bomName: "연료 시스템 F-Type",
    version: "v2.3",
    status: "ACTIVE",
    complexity: "COMPLEX",
    description: "고압 직접분사 시스템",
    createdAt: "2024-11-15T09:00:00+09:00",
    updatedAt: "2024-12-25T09:00:00+09:00",
    materials: [
      {
        partId: 1001,
        partCode: "ENG-FUEL-001",
        partName: "고압 연료 펌프",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.02,
      },
      {
        partId: 1003,
        partCode: "ENG-FUEL-002",
        partName: "연료 인젝터",
        quantity: 4,
        unit: "EA",
        scrapRate: 0.03,
      },
      {
        partId: 1006,
        partCode: "ENG-FUEL-003",
        partName: "연료 필터",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.01,
      },
    ],
  },
  {
    bomId: 7,
    bomName: "스티어링 시스템 G-Type",
    version: "v1.8",
    status: "REVIEWING",
    complexity: "NORMAL",
    description: "전동 파워 스티어링",
    createdAt: "2024-12-10T09:00:00+09:00",
    updatedAt: "2024-12-22T09:00:00+09:00",
    materials: [
      {
        partId: 2005,
        partCode: "CHS-STEER-013",
        partName: "파워 스티어링 펌프",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.01,
      },
      {
        partId: 3004,
        partCode: "ELE-ECU-001",
        partName: "엔진 제어 모듈",
        quantity: 1,
        unit: "EA",
        scrapRate: 0.02,
      },
    ],
  },
];
