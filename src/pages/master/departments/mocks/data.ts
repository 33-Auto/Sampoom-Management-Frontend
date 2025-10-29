export interface DepartmentMaster {
  deptCode: string;
  deptName: string;
  parentDept: string;
  manager: string;
  employeeCount: number;
  budget: number;
  status: string;
  createdDate: string;
}

export const mockDepartmentsMaster: DepartmentMaster[] = [
  {
    deptCode: "DEPT001",
    deptName: "경영진",
    parentDept: "-",
    manager: "김대표",
    employeeCount: 3,
    budget: 500000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT002",
    deptName: "생산부",
    parentDept: "경영진",
    manager: "이생산",
    employeeCount: 25,
    budget: 800000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT003",
    deptName: "품질관리팀",
    parentDept: "생산부",
    manager: "박품질",
    employeeCount: 8,
    budget: 150000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT004",
    deptName: "영업부",
    parentDept: "경영진",
    manager: "최영업",
    employeeCount: 12,
    budget: 300000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT005",
    deptName: "구매부",
    parentDept: "경영진",
    manager: "정구매",
    employeeCount: 6,
    budget: 200000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT006",
    deptName: "인사부",
    parentDept: "경영진",
    manager: "한인사",
    employeeCount: 4,
    budget: 100000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT007",
    deptName: "재무부",
    parentDept: "경영진",
    manager: "송재무",
    employeeCount: 5,
    budget: 120000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT008",
    deptName: "연구개발부",
    parentDept: "경영진",
    manager: "윤연구",
    employeeCount: 15,
    budget: 600000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
  {
    deptCode: "DEPT009",
    deptName: "창고관리팀",
    parentDept: "생산부",
    manager: "조창고",
    employeeCount: 9,
    budget: 80000000,
    status: "활성",
    createdDate: "2024-01-01",
  },
];
