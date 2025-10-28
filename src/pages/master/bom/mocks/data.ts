export interface BOMMaterial {
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface BOMMaster {
  bomId: string;
  bomName: string;
  category: string;
  version: string;
  status: string;
  description: string;
  createdDate: string;
  lastModified: string;
  complexity: string;
  componentCount: number;
  totalCost: number;
  materials: BOMMaterial[];
}

export const mockBOMMaster: BOMMaster[] = [
  {
    bomId: "BOM-001",
    bomName: "엔진 어셈블리 A-Type",
    category: "부품 > 기계 > 동력전달 > 어셈블리",
    version: "v2.1",
    status: "활성",
    description: "고성능 엔진 어셈블리 (2024년형)",
    createdDate: "2024-01-10",
    lastModified: "2024-01-18",
    complexity: "복잡",
    componentCount: 18,
    totalCost: 178500,
    materials: [
      {
        itemCode: "RAW-AL-001",
        itemName: "알루미늄 합금",
        quantity: 3,
        unit: "KG",
        unitCost: 8500,
      },
      {
        itemCode: "RAW-EL-003",
        itemName: "전자 센서",
        quantity: 8,
        unit: "EA",
        unitCost: 15000,
      },
      {
        itemCode: "RAW-CU-006",
        itemName: "구리 와이어",
        quantity: 15,
        unit: "M",
        unitCost: 450,
      },
      {
        itemCode: "RAW-ST-004",
        itemName: "볼트",
        quantity: 20,
        unit: "EA",
        unitCost: 200,
      },
      {
        itemCode: "RAW-PL-005",
        itemName: "플라스틱 커버",
        quantity: 5,
        unit: "EA",
        unitCost: 3000,
      },
    ],
  },
  {
    bomId: "BOM-002",
    bomName: "브레이크 시스템",
    category: "부품 > 안전 > 제동 > 브레이크",
    version: "v1.5",
    status: "활성",
    description: "안전성 강화 브레이크 시스템",
    createdDate: "2024-01-08",
    lastModified: "2024-01-15",
    complexity: "보통",
    componentCount: 8,
    totalCost: 34400,
    materials: [
      {
        itemCode: "RAW-RU-002",
        itemName: "고무 시일링",
        quantity: 12,
        unit: "EA",
        unitCost: 1200,
      },
      {
        itemCode: "RAW-ST-004",
        itemName: "M5 육각 볼트",
        quantity: 24,
        unit: "EA",
        unitCost: 150,
      },
      {
        itemCode: "RAW-OI-007",
        itemName: "유압유",
        quantity: 2,
        unit: "L",
        unitCost: 2800,
      },
      {
        itemCode: "RAW-EL-003",
        itemName: "센서",
        quantity: 4,
        unit: "EA",
        unitCost: 8000,
      },
    ],
  },
  {
    bomId: "BOM-003",
    bomName: "전자제어 모듈",
    category: "부품 > 전자 > 제어 > 모듈",
    version: "v3.0",
    status: "검토중",
    description: "차세대 전자제어 시스템",
    createdDate: "2024-01-12",
    lastModified: "2024-01-19",
    complexity: "단순",
    componentCount: 5,
    totalCost: 89600,
    materials: [
      {
        itemCode: "RAW-EL-003",
        itemName: "전자 센서",
        quantity: 5,
        unit: "EA",
        unitCost: 15000,
      },
      {
        itemCode: "RAW-PL-005",
        itemName: "플라스틱 하우징",
        quantity: 2,
        unit: "EA",
        unitCost: 3200,
      },
      {
        itemCode: "RAW-CU-006",
        itemName: "구리 와이어",
        quantity: 8,
        unit: "M",
        unitCost: 450,
      },
    ],
  },
  {
    bomId: "BOM-004",
    bomName: "서스펜션 키트",
    category: "부품 > 섀시 > 현가장치 > 서스펜션",
    version: "v1.0",
    status: "비활성",
    description: "구형 서스펜션 시스템 (단종)",
    createdDate: "2023-12-20",
    lastModified: "2024-01-05",
    complexity: "단순",
    componentCount: 4,
    totalCost: 27200,
    materials: [
      {
        itemCode: "RAW-PL-005",
        itemName: "플라스틱 하우징",
        quantity: 1,
        unit: "EA",
        unitCost: 3200,
      },
      {
        itemCode: "RAW-RU-002",
        itemName: "고무 시일링",
        quantity: 6,
        unit: "EA",
        unitCost: 1200,
      },
      {
        itemCode: "RAW-BE-008",
        itemName: "베어링",
        quantity: 4,
        unit: "EA",
        unitCost: 12000,
      },
    ],
  },
];
