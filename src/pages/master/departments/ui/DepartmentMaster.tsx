import { useState } from "react";

import {
  Button,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { useDepartmentStats } from "../model/useDepartmentStats";

export const DepartmentMaster = () => {
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

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "활성", label: "활성" },
    { value: "비활성", label: "비활성" },
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

  // 통계 계산 (훅으로 분리)
  const { totalDepts, activeDepts, totalEmployees, totalBudget } =
    useDepartmentStats(departmentData);

  return (
    <>
      {/* 메인 컨텐츠 */}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-organization-chart"
          label="전체 부서"
          value={totalDepts}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="ri-check-line"
          label="활성 부서"
          value={activeDepts}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          icon="ri-team-line"
          label="총 인원"
          value={`${totalEmployees}명`}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          icon="ri-money-dollar-circle-line"
          label="총 예산"
          value={`₩${(totalBudget / 100000000).toFixed(1)}억`}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="부서명, 코드, 부서장으로 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
        ]}
        actions={
          <>
            <Button variant="outline">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
            <Button variant="default">
              <i className="ri-add-line mr-2"></i>새 부서 등록
            </Button>
          </>
        }
      />

      {/* 부서 관리 테이블 */}
      <TableSection
        title="부서 목록"
        metaRight={
          <span className="text-sm text-gray-500">
            총 {filteredData.length}개 부서
          </span>
        }
        actionsRight={
          <Button variant="secondary" size="sm">
            <i className="ri-refresh-line mr-2"></i>
            새로고침
          </Button>
        }
      >
        <Table
          columns={columns}
          data={filteredData}
          emptyText="조건에 맞는 부서가 없습니다"
        />
      </TableSection>
    </>
  );
};
