import { useState } from "react";

import { Button, Input, Select, Table } from "@/shared/ui";

export default function DepartmentMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");

  // 부서 데이터
  const departmentData = [
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

  const filteredData = departmentData.filter((dept) => {
    const matchesSearch =
      dept.deptName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.deptCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: "deptCode", title: "부서 코드", width: "120px" },
    { key: "deptName", title: "부서명" },
    { key: "parentDept", title: "상위 부서", width: "150px" },
    { key: "manager", title: "부서장", width: "120px" },
    {
      key: "employeeCount",
      title: "인원수",
      width: "80px",
      render: (value: number) => `${value}명`,
    },
    {
      key: "budget",
      title: "예산",
      width: "150px",
      render: (value: number) => `₩${(value / 100000000).toFixed(1)}억`,
    },
    {
      key: "status",
      title: "상태",
      width: "80px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "활성"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "createdDate", title: "생성일", width: "120px" },
  ];

  // 통계 계산
  const totalDepts = departmentData.length;
  const activeDepts = departmentData.filter(
    (dept) => dept.status === "활성",
  ).length;
  const totalEmployees = departmentData.reduce(
    (sum, dept) => sum + dept.employeeCount,
    0,
  );
  const totalBudget = departmentData.reduce(
    (sum, dept) => sum + dept.budget,
    0,
  );

  return (
    <>
      {/* 메인 컨텐츠 */}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <i className="ri-organization-chart text-xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 부서</p>
              <p className="text-2xl font-bold text-gray-900">{totalDepts}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <i className="ri-check-line text-xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 부서</p>
              <p className="text-2xl font-bold text-gray-900">{activeDepts}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <i className="ri-team-line text-xl text-purple-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 인원</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEmployees}명
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <i className="ri-money-dollar-circle-line text-xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">총 예산</p>
              <p className="text-2xl font-bold text-gray-900">
                ₩{(totalBudget / 100000000).toFixed(1)}억
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 부서 관리 테이블 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">부서 목록</h2>
            <div className="flex space-x-3">
              <Button variant="outline">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
              <Button variant="default">
                <i className="ri-add-line mr-2"></i>새 부서 등록
              </Button>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="부서명, 코드, 부서장으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={[
                { value: "전체", label: "전체 상태" },
                { value: "활성", label: "활성" },
                { value: "비활성", label: "비활성" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Button variant="secondary" size="sm">
              <i className="ri-refresh-line mr-2"></i>
              새로고침
            </Button>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            data={filteredData}
            emptyText="조건에 맞는 부서가 없습니다"
          />
        </div>
      </div>
    </>
  );
}
