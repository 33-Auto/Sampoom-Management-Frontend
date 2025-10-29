export interface PositionMaster {
  positionCode: string;
  positionName: string;
  level: number;
  category: string;
  baseSalary: number;
  allowance: number;
  description: string;
  employeeCount: number;
  status: string;
  createdDate: string;
}

export const mockPositionsMaster: PositionMaster[] = [
  {
    positionCode: "POS001",
    positionName: "대표이사",
    level: 1,
    category: "임원",
    baseSalary: 15000000,
    allowance: 3000000,
    description: "회사 최고 경영진",
    employeeCount: 1,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    positionCode: "POS002",
    positionName: "상무이사",
    level: 2,
    category: "임원",
    baseSalary: 12000000,
    allowance: 2500000,
    description: "부문별 최고 책임자",
    employeeCount: 2,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    positionCode: "POS003",
    positionName: "부장",
    level: 3,
    category: "관리직",
    baseSalary: 8000000,
    allowance: 1500000,
    description: "부서 책임자",
    employeeCount: 9,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    positionCode: "POS004",
    positionName: "차장",
    level: 4,
    category: "관리직",
    baseSalary: 6500000,
    allowance: 1200000,
    description: "부서 차석 관리자",
    employeeCount: 12,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    positionCode: "POS005",
    positionName: "과장",
    level: 5,
    category: "관리직",
    baseSalary: 5500000,
    allowance: 1000000,
    description: "팀 리더",
    employeeCount: 18,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    positionCode: "POS006",
    positionName: "대리",
    level: 6,
    category: "일반직",
    baseSalary: 4500000,
    allowance: 800000,
    description: "중급 실무자",
    employeeCount: 22,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    positionCode: "POS007",
    positionName: "주임",
    level: 7,
    category: "일반직",
    baseSalary: 3800000,
    allowance: 600000,
    description: "초급 실무자",
    employeeCount: 15,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    positionCode: "POS008",
    positionName: "사원",
    level: 8,
    category: "일반직",
    baseSalary: 3200000,
    allowance: 400000,
    description: "신입 직원",
    employeeCount: 8,
    status: "활성",
    createdDate: "2024-01-01",
  },
];
