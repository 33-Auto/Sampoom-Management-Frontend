import type { ProcessResponseDTO } from "../model";

export interface RoutingOperation {
  operationNumber: number;
  operationName: string;
  workCenterCode: string;
  setupTime: number;
  processTime: number;
  waitTime: number;
}

export interface RoutingMaster {
  routingCode: string;
  itemCode: string;
  itemName: string;
  version: string;
  status: string;
  totalLeadTime: number;
  operationCount: number;
  operations: RoutingOperation[];
}

// 시드 원본, 아래에서 API 응답 모양으로 한 번 바꿔 쓴다
const mockRoutingsMaster: RoutingMaster[] = [
  {
    routingCode: "RT001",
    itemCode: "MAT001",
    itemName: "스테인리스 스틸 봉재",
    version: "1.0",
    status: "활성",
    totalLeadTime: 12,
    operationCount: 4,
    operations: [
      {
        operationNumber: 10,
        operationName: "절삭 가공",
        workCenterCode: "WC001",
        setupTime: 30,
        processTime: 5,
        waitTime: 60,
      },
      {
        operationNumber: 20,
        operationName: "밀링 가공",
        workCenterCode: "WC002",
        setupTime: 45,
        processTime: 8,
        waitTime: 120,
      },
      {
        operationNumber: 30,
        operationName: "표면처리",
        workCenterCode: "WC004",
        setupTime: 15,
        processTime: 3,
        waitTime: 180,
      },
      {
        operationNumber: 40,
        operationName: "품질검사",
        workCenterCode: "WC006",
        setupTime: 10,
        processTime: 2,
        waitTime: 0,
      },
    ],
  },
  {
    routingCode: "RT002",
    itemCode: "MAT002",
    itemName: "알루미늄 합금 판재",
    version: "1.0",
    status: "활성",
    totalLeadTime: 8,
    operationCount: 3,
    operations: [
      {
        operationNumber: 10,
        operationName: "절단 가공",
        workCenterCode: "WC001",
        setupTime: 20,
        processTime: 3,
        waitTime: 60,
      },
      {
        operationNumber: 20,
        operationName: "표면처리",
        workCenterCode: "WC004",
        setupTime: 15,
        processTime: 2,
        waitTime: 120,
      },
      {
        operationNumber: 30,
        operationName: "품질검사",
        workCenterCode: "WC006",
        setupTime: 10,
        processTime: 1,
        waitTime: 0,
      },
    ],
  },
  {
    routingCode: "RT003",
    itemCode: "SEMI001",
    itemName: "플라스틱 하우징",
    version: "1.1",
    status: "활성",
    totalLeadTime: 16,
    operationCount: 5,
    operations: [
      {
        operationNumber: 10,
        operationName: "사출 성형",
        workCenterCode: "WC002",
        setupTime: 60,
        processTime: 2,
        waitTime: 240,
      },
      {
        operationNumber: 20,
        operationName: "트리밍",
        workCenterCode: "WC001",
        setupTime: 15,
        processTime: 1,
        waitTime: 60,
      },
      {
        operationNumber: 30,
        operationName: "표면처리",
        workCenterCode: "WC004",
        setupTime: 30,
        processTime: 3,
        waitTime: 180,
      },
      {
        operationNumber: 40,
        operationName: "조립 준비",
        workCenterCode: "WC005",
        setupTime: 20,
        processTime: 2,
        waitTime: 60,
      },
      {
        operationNumber: 50,
        operationName: "품질검사",
        workCenterCode: "WC006",
        setupTime: 15,
        processTime: 3,
        waitTime: 0,
      },
    ],
  },
  {
    routingCode: "RT004",
    itemCode: "SEMI002",
    itemName: "기계 부품 어셈블리",
    version: "2.0",
    status: "활성",
    totalLeadTime: 24,
    operationCount: 6,
    operations: [
      {
        operationNumber: 10,
        operationName: "정밀 가공",
        workCenterCode: "EXT001",
        setupTime: 120,
        processTime: 15,
        waitTime: 480,
      },
      {
        operationNumber: 20,
        operationName: "열처리",
        workCenterCode: "EXT002",
        setupTime: 60,
        processTime: 0,
        waitTime: 720,
      },
      {
        operationNumber: 30,
        operationName: "정밀 밀링",
        workCenterCode: "WC002",
        setupTime: 45,
        processTime: 12,
        waitTime: 120,
      },
      {
        operationNumber: 40,
        operationName: "용접",
        workCenterCode: "WC003",
        setupTime: 30,
        processTime: 8,
        waitTime: 180,
      },
      {
        operationNumber: 50,
        operationName: "조립",
        workCenterCode: "WC005",
        setupTime: 60,
        processTime: 10,
        waitTime: 120,
      },
      {
        operationNumber: 60,
        operationName: "최종검사",
        workCenterCode: "WC006",
        setupTime: 20,
        processTime: 5,
        waitTime: 0,
      },
    ],
  },
  {
    routingCode: "RT005",
    itemCode: "FIN001",
    itemName: "자동차 엔진 부품",
    version: "1.0",
    status: "검토중",
    totalLeadTime: 32,
    operationCount: 7,
    operations: [
      {
        operationNumber: 10,
        operationName: "주조",
        workCenterCode: "EXT001",
        setupTime: 180,
        processTime: 0,
        waitTime: 1440,
      },
      {
        operationNumber: 20,
        operationName: "거친 가공",
        workCenterCode: "WC001",
        setupTime: 60,
        processTime: 20,
        waitTime: 240,
      },
      {
        operationNumber: 30,
        operationName: "열처리",
        workCenterCode: "EXT002",
        setupTime: 30,
        processTime: 0,
        waitTime: 480,
      },
      {
        operationNumber: 40,
        operationName: "정밀 가공",
        workCenterCode: "WC002",
        setupTime: 90,
        processTime: 25,
        waitTime: 180,
      },
      {
        operationNumber: 50,
        operationName: "표면처리",
        workCenterCode: "WC004",
        setupTime: 45,
        processTime: 5,
        waitTime: 360,
      },
      {
        operationNumber: 60,
        operationName: "최종 조립",
        workCenterCode: "WC005",
        setupTime: 120,
        processTime: 15,
        waitTime: 120,
      },
      {
        operationNumber: 70,
        operationName: "성능 테스트",
        workCenterCode: "WC006",
        setupTime: 30,
        processTime: 10,
        waitTime: 0,
      },
    ],
  },
];

// itemCode를 기반으로 기본 품목 정보 생성, 다른 slice를 참조하지 않는다
function getItemInfoByCode(itemCode: string) {
  // routing 데이터에 포함된 정보를 기반으로 기본값 반환
  const routing = mockRoutingsMaster.find((r) => r.itemCode === itemCode);
  if (!routing) {
    return null;
  }

  // 기본 카테고리/그룹 정보, routing 데이터 기반 추론
  const categoryMap: Record<
    string,
    {
      categoryId: number;
      categoryName: string;
      groupId: number;
      groupName: string;
    }
  > = {
    MAT001: {
      categoryId: 301,
      categoryName: "철강",
      groupId: 0,
      groupName: "",
    },
    MAT002: {
      categoryId: 301,
      categoryName: "철강",
      groupId: 0,
      groupName: "",
    },
    SEMI001: {
      categoryId: 303,
      categoryName: "플라스틱/고무",
      groupId: 0,
      groupName: "",
    },
    SEMI002: {
      categoryId: 1,
      categoryName: "엔진 부품",
      groupId: 12,
      groupName: "엔진 블록",
    },
    FIN001: {
      categoryId: 1,
      categoryName: "엔진 부품",
      groupId: 11,
      groupName: "연료 공급",
    },
  };

  const categoryInfo = categoryMap[itemCode] || {
    categoryId: 0,
    categoryName: "",
    groupId: 0,
    groupName: "",
  };

  return {
    id: 1000 + mockRoutingsMaster.indexOf(routing),
    categoryId: categoryInfo.categoryId,
    categoryName: categoryInfo.categoryName,
    groupId: categoryInfo.groupId,
    groupName: categoryInfo.groupName,
  };
}

const toProcess = (
  routing: RoutingMaster,
  index: number,
): ProcessResponseDTO => {
  const item = getItemInfoByCode(routing.itemCode);
  return {
    id: index + 1,
    code: routing.routingCode,
    partId: item?.id || index + 1,
    partName: routing.itemName,
    partCode: routing.itemCode,
    version: routing.version,
    status: routing.status === "활성" ? "ACTIVE" : "INACTIVE",
    quantity: 1,
    stepCount: routing.operationCount,
    categoryId: item?.categoryId,
    categoryName: item?.categoryName,
    groupId: item?.groupId,
    groupName: item?.groupName,
    totalSetupMinutes: routing.operations.reduce(
      (sum, op) => sum + op.setupTime,
      0,
    ),
    totalProcessMinutes: routing.operations.reduce(
      (sum, op) => sum + op.processTime,
      0,
    ),
    totalWaitMinutes: routing.operations.reduce(
      (sum, op) => sum + op.waitTime,
      0,
    ),
    totalStepMinutes: routing.totalLeadTime * 60, // 시간을 분으로 변환
    totalProcessCost: routing.operations.reduce(
      (sum, op) => sum + op.processTime * 50000,
      0,
    ), // 임시 계산
    steps: routing.operations.map((op) => ({
      stepOrder: op.operationNumber,
      stepName: op.operationName,
      workCenterCode: op.workCenterCode,
      setupMinutes: op.setupTime,
      processMinutes: op.processTime,
      waitMinutes: op.waitTime,
    })),
  };
};

// 공정 목록과 등록·수정·삭제가 함께 쓰는 단일 데이터
export const mockProcessesMaster: ProcessResponseDTO[] =
  mockRoutingsMaster.map(toProcess);
