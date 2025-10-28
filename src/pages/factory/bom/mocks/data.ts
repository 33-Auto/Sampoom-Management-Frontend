export interface BOMMaterial {
  code: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface FactoryBOM {
  id: string;
  productName: string;
  version: string;
  status: string;
  createdDate: string;
  lastModified: string;
  materials: BOMMaterial[];
}

export const mockFactoryBOMs: FactoryBOM[] = [
  {
    id: "BOM-001",
    productName: "엔진 어셈블리 A-Type",
    version: "v2.1",
    status: "active",
    createdDate: "2024-01-10",
    lastModified: "2024-01-14",
    materials: [
      {
        code: "MAT-001",
        name: "알루미늄 합금 봉재",
        quantity: 2,
        unit: "kg",
      },
      { code: "MAT-003", name: "전자 센서", quantity: 4, unit: "개" },
      { code: "MAT-006", name: "구리 와이어", quantity: 15, unit: "m" },
    ],
  },
  {
    id: "BOM-002",
    productName: "브레이크 시스템 B-Type",
    version: "v1.5",
    status: "active",
    createdDate: "2024-01-08",
    lastModified: "2024-01-12",
    materials: [
      { code: "MAT-002", name: "고무 시일링", quantity: 8, unit: "개" },
      { code: "MAT-004", name: "스테인리스 볼트", quantity: 12, unit: "개" },
      { code: "MAT-008", name: "베어링", quantity: 2, unit: "개" },
    ],
  },
  {
    id: "BOM-003",
    productName: "전자 제어 모듈",
    version: "v3.0",
    status: "draft",
    createdDate: "2024-01-12",
    lastModified: "2024-01-15",
    materials: [
      { code: "MAT-003", name: "전자 센서", quantity: 6, unit: "개" },
      { code: "MAT-005", name: "플라스틱 하우징", quantity: 1, unit: "개" },
      { code: "MAT-006", name: "구리 와이어", quantity: 25, unit: "m" },
    ],
  },
  {
    id: "BOM-004",
    productName: "필터 어셈블리",
    version: "v1.2",
    status: "inactive",
    createdDate: "2024-01-05",
    lastModified: "2024-01-09",
    materials: [
      { code: "MAT-005", name: "플라스틱 하우징", quantity: 2, unit: "개" },
      { code: "MAT-002", name: "고무 시일링", quantity: 4, unit: "개" },
    ],
  },
  {
    id: "BOM-005",
    productName: "금속 부품 세트",
    version: "v2.3",
    status: "active",
    createdDate: "2024-01-11",
    lastModified: "2024-01-13",
    materials: [
      {
        code: "MAT-001",
        name: "알루미늄 합금 봉재",
        quantity: 5,
        unit: "kg",
      },
      { code: "MAT-004", name: "스테인리스 볼트", quantity: 20, unit: "개" },
      { code: "MAT-008", name: "베어링", quantity: 3, unit: "개" },
    ],
  },
];
