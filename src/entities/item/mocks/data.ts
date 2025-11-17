export type ItemCategory = {
  categoryId: number;
  categoryName: string;
  name?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
};

export type ItemGroup = {
  groupId: number;
  categoryId: number;
  groupName: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
};

export type ItemPart = {
  id: number;
  categoryId: number;
  groupId: number;
  code: string;
  name: string;
  uom: string;
  leadTimeDays: number;
};

export const mockItemCategories: ItemCategory[] = [
  {
    categoryId: 1,
    categoryName: "엔진 부품",
    name: "엔진 부품",
    description: "엔진 및 동력전달 관련 핵심 부품",
    status: "ACTIVE",
  },
  {
    categoryId: 2,
    categoryName: "섀시 부품",
    name: "섀시 부품",
    description: "차체 및 서스펜션 관련 부품",
    status: "ACTIVE",
  },
  {
    categoryId: 3,
    categoryName: "전자 부품",
    name: "전자 부품",
    description: "센서, 제어 모듈 등 전장 부품",
    status: "ACTIVE",
  },
  {
    categoryId: 4,
    categoryName: "냉각 시스템",
    name: "냉각 시스템",
    description: "라디에이터, 워터펌프 등 냉각 관련 부품",
    status: "ACTIVE",
  },
  {
    categoryId: 5,
    categoryName: "배기 시스템",
    name: "배기 시스템",
    description: "매니폴드, 촉매변환기 등 배기 관련 부품",
    status: "ACTIVE",
  },
];

export const mockItemGroups: ItemGroup[] = [
  {
    groupId: 11,
    categoryId: 1,
    groupName: "연료 공급",
    description: "연료 펌프, 인젝터 등",
    status: "ACTIVE",
  },
  {
    groupId: 12,
    categoryId: 1,
    groupName: "엔진 블록",
    description: "블록, 피스톤, 크랭크축",
    status: "ACTIVE",
  },
  {
    groupId: 21,
    categoryId: 2,
    groupName: "현가 장치",
    description: "쇼크업소버, 스프링",
    status: "ACTIVE",
  },
  {
    groupId: 22,
    categoryId: 2,
    groupName: "제동 장치",
    description: "패드, 디스크 등 제동계",
    status: "ACTIVE",
  },
  {
    groupId: 31,
    categoryId: 3,
    groupName: "센서 모듈",
    description: "온도/압력/ABS 센서",
    status: "ACTIVE",
  },
  {
    groupId: 13,
    categoryId: 1,
    groupName: "냉각 시스템",
    description: "워터펌프, 서모스탯",
    status: "ACTIVE",
  },
  {
    groupId: 23,
    categoryId: 2,
    groupName: "스티어링",
    description: "스티어링 휠, 랙",
    status: "ACTIVE",
  },
  {
    groupId: 32,
    categoryId: 3,
    groupName: "제어 모듈",
    description: "ECU, TCU 등",
    status: "ACTIVE",
  },
  {
    groupId: 41,
    categoryId: 4,
    groupName: "라디에이터",
    description: "냉각수 라디에이터",
    status: "ACTIVE",
  },
  {
    groupId: 51,
    categoryId: 5,
    groupName: "배기 매니폴드",
    description: "배기관, 매니폴드",
    status: "ACTIVE",
  },
];

export const mockItemParts: ItemPart[] = [
  {
    id: 1001,
    categoryId: 1,
    groupId: 11,
    code: "ENG-FUEL-001",
    name: "고압 연료 펌프",
    uom: "EA",
    leadTimeDays: 7,
  },
  {
    id: 1002,
    categoryId: 1,
    groupId: 12,
    code: "ENG-BLOCK-010",
    name: "알루미늄 엔진 블록",
    uom: "EA",
    leadTimeDays: 21,
  },
  {
    id: 2001,
    categoryId: 2,
    groupId: 21,
    code: "CHS-SUS-005",
    name: "후륜 서스펜션 스프링",
    uom: "EA",
    leadTimeDays: 10,
  },
  {
    id: 2002,
    categoryId: 2,
    groupId: 22,
    code: "CHS-BRAKE-008",
    name: "세라믹 브레이크 패드",
    uom: "SET",
    leadTimeDays: 5,
  },
  {
    id: 3001,
    categoryId: 3,
    groupId: 31,
    code: "ELE-SENSOR-003",
    name: "ABS 휠 속도 센서",
    uom: "EA",
    leadTimeDays: 9,
  },
  {
    id: 3002,
    categoryId: 3,
    groupId: 31,
    code: "ELE-SENSOR-010",
    name: "배기가스 온도 센서",
    uom: "EA",
    leadTimeDays: 12,
  },
  {
    id: 1003,
    categoryId: 1,
    groupId: 11,
    code: "ENG-FUEL-002",
    name: "연료 인젝터",
    uom: "EA",
    leadTimeDays: 8,
  },
  {
    id: 1004,
    categoryId: 1,
    groupId: 12,
    code: "ENG-BLOCK-011",
    name: "크랭크샤프트",
    uom: "EA",
    leadTimeDays: 25,
  },
  {
    id: 1005,
    categoryId: 1,
    groupId: 13,
    code: "ENG-COOL-001",
    name: "워터펌프",
    uom: "EA",
    leadTimeDays: 6,
  },
  {
    id: 2003,
    categoryId: 2,
    groupId: 21,
    code: "CHS-SUS-006",
    name: "전륜 서스펜션 스프링",
    uom: "EA",
    leadTimeDays: 9,
  },
  {
    id: 2004,
    categoryId: 2,
    groupId: 22,
    code: "CHS-BRAKE-009",
    name: "브레이크 디스크",
    uom: "EA",
    leadTimeDays: 7,
  },
  {
    id: 2005,
    categoryId: 2,
    groupId: 23,
    code: "CHS-STEER-013",
    name: "파워 스티어링 펌프",
    uom: "EA",
    leadTimeDays: 11,
  },
  {
    id: 3003,
    categoryId: 3,
    groupId: 31,
    code: "ELE-SENSOR-011",
    name: "산소 센서",
    uom: "EA",
    leadTimeDays: 10,
  },
  {
    id: 3004,
    categoryId: 3,
    groupId: 32,
    code: "ELE-ECU-001",
    name: "엔진 제어 모듈",
    uom: "EA",
    leadTimeDays: 15,
  },
  {
    id: 4001,
    categoryId: 4,
    groupId: 41,
    code: "COOL-RAD-001",
    name: "알루미늄 라디에이터",
    uom: "EA",
    leadTimeDays: 12,
  },
  {
    id: 5001,
    categoryId: 5,
    groupId: 51,
    code: "EXH-MAN-001",
    name: "배기 매니폴드",
    uom: "EA",
    leadTimeDays: 14,
  },
  {
    id: 1006,
    categoryId: 1,
    groupId: 11,
    code: "ENG-FUEL-003",
    name: "연료 필터",
    uom: "EA",
    leadTimeDays: 4,
  },
  {
    id: 1007,
    categoryId: 1,
    groupId: 12,
    code: "ENG-BLOCK-012",
    name: "피스톤 링 세트",
    uom: "SET",
    leadTimeDays: 18,
  },
  {
    id: 2006,
    categoryId: 2,
    groupId: 21,
    code: "CHS-SUS-007",
    name: "쇼크 업소버",
    uom: "EA",
    leadTimeDays: 13,
  },
  {
    id: 2007,
    categoryId: 2,
    groupId: 22,
    code: "CHS-BRAKE-010",
    name: "브레이크 캘리퍼",
    uom: "EA",
    leadTimeDays: 8,
  },
  {
    id: 3005,
    categoryId: 3,
    groupId: 31,
    code: "ELE-SENSOR-012",
    name: "압력 센서",
    uom: "EA",
    leadTimeDays: 11,
  },
  {
    id: 3006,
    categoryId: 3,
    groupId: 32,
    code: "ELE-TCU-001",
    name: "변속기 제어 모듈",
    uom: "EA",
    leadTimeDays: 16,
  },
];
