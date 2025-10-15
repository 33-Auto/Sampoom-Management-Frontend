export type WorkCenterRecord = {
  id: number;
  name: string;
  code: string;
  type: "INTERNAL" | "EXTERNAL";
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  dailyOperatingHours: number;
  efficiency: number;
  costPerHour: number;
};

export const mockWorkCenters: WorkCenterRecord[] = [
  {
    id: 401,
    name: "엔진 가공 1호기",
    code: "WC-ENG-001",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 16,
    efficiency: 92,
    costPerHour: 180000,
  },
  {
    id: 402,
    name: "열처리 외주",
    code: "WC-HT-EXT",
    type: "EXTERNAL",
    status: "MAINTENANCE",
    dailyOperatingHours: 12,
    efficiency: 80,
    costPerHour: 220000,
  },
  {
    id: 403,
    name: "CNC 가공 2호기",
    code: "WC-CNC-002",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 16,
    efficiency: 88,
    costPerHour: 195000,
  },
  {
    id: 404,
    name: "용접 라인 A",
    code: "WC-WELD-A",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 14,
    efficiency: 85,
    costPerHour: 165000,
  },
  {
    id: 405,
    name: "도장 라인",
    code: "WC-PAINT-001",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 12,
    efficiency: 90,
    costPerHour: 180000,
  },
  {
    id: 406,
    name: "조립 라인 B",
    code: "WC-ASSY-B",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 16,
    efficiency: 92,
    costPerHour: 175000,
  },
  {
    id: 407,
    name: "검사 라인",
    code: "WC-QC-001",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 14,
    efficiency: 95,
    costPerHour: 150000,
  },
  {
    id: 408,
    name: "포장 라인",
    code: "WC-PACK-001",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 12,
    efficiency: 93,
    costPerHour: 120000,
  },
  {
    id: 409,
    name: "표면처리 외주",
    code: "WC-SURF-EXT",
    type: "EXTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 10,
    efficiency: 82,
    costPerHour: 200000,
  },
  {
    id: 410,
    name: "프레스 가공",
    code: "WC-PRESS-001",
    type: "INTERNAL",
    status: "ACTIVE",
    dailyOperatingHours: 16,
    efficiency: 87,
    costPerHour: 190000,
  },
];
