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

export const mockRoutingsMaster: RoutingMaster[] = [
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
