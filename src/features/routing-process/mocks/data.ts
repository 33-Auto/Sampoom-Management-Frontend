export type RoutingStep = {
  stepOrder: number;
  workCenterName: string;
  standardTime: number;
  description?: string;
};

export type RoutingRecord = {
  id: number;
  name: string;
  code: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  steps: RoutingStep[];
};

export const mockRoutingRecords: RoutingRecord[] = [
  {
    id: 301,
    name: "엔진 조립 표준공정",
    code: "RO-ENG-001",
    description: "엔진 어셈블리 표준 라우팅",
    status: "ACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "머시닝센터",
        standardTime: 45,
        description: "엔진 블록 가공",
      },
      {
        stepOrder: 2,
        workCenterName: "조립라인 A",
        standardTime: 35,
        description: "주요 부품 조립",
      },
      {
        stepOrder: 3,
        workCenterName: "검사 라인",
        standardTime: 20,
        description: "토크 및 누유 검사",
      },
    ],
  },
  {
    id: 302,
    name: "브레이크 모듈 공정",
    code: "RO-BRK-002",
    description: "브레이크 시스템 라우팅",
    status: "INACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "CNC 가공",
        standardTime: 30,
      },
      {
        stepOrder: 2,
        workCenterName: "도장 라인",
        standardTime: 25,
      },
    ],
  },
  {
    id: 303,
    name: "서스펜션 조립 공정",
    code: "RO-SUS-003",
    description: "서스펜션 시스템 조립",
    status: "ACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "프레스 가공",
        standardTime: 25,
        description: "스프링 가공",
      },
      {
        stepOrder: 2,
        workCenterName: "조립 라인 B",
        standardTime: 40,
        description: "서스펜션 조립",
      },
      {
        stepOrder: 3,
        workCenterName: "검사 라인",
        standardTime: 15,
        description: "내구성 검사",
      },
    ],
  },
  {
    id: 304,
    name: "센서 모듈 공정",
    code: "RO-SENSOR-004",
    description: "전자 센서 모듈 조립",
    status: "ACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "용접 라인 A",
        standardTime: 20,
        description: "센서 하우징 용접",
      },
      {
        stepOrder: 2,
        workCenterName: "조립 라인 B",
        standardTime: 30,
        description: "센서 모듈 조립",
      },
      {
        stepOrder: 3,
        workCenterName: "검사 라인",
        standardTime: 25,
        description: "센서 기능 검사",
      },
    ],
  },
  {
    id: 305,
    name: "냉각 시스템 공정",
    code: "RO-COOL-005",
    description: "라디에이터 및 냉각 시스템",
    status: "ACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "CNC 가공 2호기",
        standardTime: 35,
        description: "라디에이터 코어 가공",
      },
      {
        stepOrder: 2,
        workCenterName: "용접 라인 A",
        standardTime: 28,
        description: "튜브 용접",
      },
      {
        stepOrder: 3,
        workCenterName: "도장 라인",
        standardTime: 20,
        description: "방청 도장",
      },
    ],
  },
  {
    id: 306,
    name: "배기 시스템 공정",
    code: "RO-EXH-006",
    description: "배기 매니폴드 제조",
    status: "ACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "프레스 가공",
        standardTime: 40,
        description: "매니폴드 성형",
      },
      {
        stepOrder: 2,
        workCenterName: "용접 라인 A",
        standardTime: 35,
        description: "배기관 용접",
      },
      {
        stepOrder: 3,
        workCenterName: "검사 라인",
        standardTime: 18,
        description: "누출 검사",
      },
    ],
  },
  {
    id: 307,
    name: "연료 시스템 공정",
    code: "RO-FUEL-007",
    description: "연료 펌프 및 인젝터",
    status: "ACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "엔진 가공 1호기",
        standardTime: 50,
        description: "펌프 하우징 가공",
      },
      {
        stepOrder: 2,
        workCenterName: "조립 라인 B",
        standardTime: 45,
        description: "펌프 조립",
      },
      {
        stepOrder: 3,
        workCenterName: "검사 라인",
        standardTime: 30,
        description: "유량 및 압력 검사",
      },
    ],
  },
  {
    id: 308,
    name: "스티어링 시스템 공정",
    code: "RO-STEER-008",
    description: "파워 스티어링 시스템",
    status: "ACTIVE",
    steps: [
      {
        stepOrder: 1,
        workCenterName: "CNC 가공 2호기",
        standardTime: 38,
        description: "스티어링 랙 가공",
      },
      {
        stepOrder: 2,
        workCenterName: "조립 라인 B",
        standardTime: 42,
        description: "스티어링 조립",
      },
      {
        stepOrder: 3,
        workCenterName: "검사 라인",
        standardTime: 22,
        description: "토크 검사",
      },
    ],
  },
];
