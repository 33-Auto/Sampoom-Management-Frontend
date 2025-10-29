export interface WorkCenterMaster {
  workCenterCode: string;
  workCenterName: string;
  type: string;
  dailyCapacity: number;
  efficiency: number;
  hourlyRate: number;
  status: string;
  description: string;
}

export const mockWorkCentersMaster: WorkCenterMaster[] = [
  {
    workCenterCode: "WC001",
    workCenterName: "절삭 가공 1호기",
    type: "내부 설비",
    dailyCapacity: 16,
    efficiency: 85,
    hourlyRate: 45000,
    status: "가동",
    description: "CNC 선반 가공",
  },
  {
    workCenterCode: "WC002",
    workCenterName: "밀링 가공 1호기",
    type: "내부 설비",
    dailyCapacity: 16,
    efficiency: 90,
    hourlyRate: 50000,
    status: "가동",
    description: "CNC 밀링 가공",
  },
  {
    workCenterCode: "WC003",
    workCenterName: "용접 작업장",
    type: "내부 설비",
    dailyCapacity: 8,
    efficiency: 75,
    hourlyRate: 35000,
    status: "가동",
    description: "아르곤 용접",
  },
  {
    workCenterCode: "WC004",
    workCenterName: "표면처리 라인",
    type: "내부 설비",
    dailyCapacity: 24,
    efficiency: 95,
    hourlyRate: 25000,
    status: "가동",
    description: "도장 및 코팅",
  },
  {
    workCenterCode: "WC005",
    workCenterName: "조립 라인 A",
    type: "내부 설비",
    dailyCapacity: 8,
    efficiency: 80,
    hourlyRate: 30000,
    status: "가동",
    description: "최종 조립",
  },
  {
    workCenterCode: "WC006",
    workCenterName: "품질 검사실",
    type: "검사 설비",
    dailyCapacity: 8,
    efficiency: 100,
    hourlyRate: 40000,
    status: "가동",
    description: "최종 품질 검사",
  },
  {
    workCenterCode: "EXT001",
    workCenterName: "(주)정밀가공",
    type: "외주 가공처",
    dailyCapacity: 16,
    efficiency: 90,
    hourlyRate: 38000,
    status: "가동",
    description: "정밀 가공 외주",
  },
  {
    workCenterCode: "EXT002",
    workCenterName: "(주)열처리전문",
    type: "외주 가공처",
    dailyCapacity: 24,
    efficiency: 95,
    hourlyRate: 28000,
    status: "가동",
    description: "열처리 전문 업체",
  },
  {
    workCenterCode: "WC007",
    workCenterName: "포장 라인",
    type: "내부 설비",
    dailyCapacity: 8,
    efficiency: 90,
    hourlyRate: 20000,
    status: "정비",
    description: "제품 포장",
  },
  {
    workCenterCode: "WC008",
    workCenterName: "절삭 가공 2호기",
    type: "내부 설비",
    dailyCapacity: 16,
    efficiency: 80,
    hourlyRate: 42000,
    status: "중단",
    description: "CNC 선반 가공 (예비)",
  },
];
