import { useState } from "react";

import { Button, Input, Select, Table } from "@/shared/ui";

export default function PositionMaster() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("전체");

  // 직급 데이터
  const positionData = [
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

  const filteredData = positionData.filter((position) => {
    const matchesSearch =
      position.positionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.positionCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      levelFilter === "전체" || position.category === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const columns = [
    { key: "positionCode", title: "직급 코드", width: "120px" },
    { key: "positionName", title: "직급명", width: "120px" },
    {
      key: "level",
      title: "레벨",
      width: "80px",
      render: (value: number) => (
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "category",
      title: "구분",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "임원"
              ? "bg-purple-100 text-purple-800"
              : value === "관리직"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "baseSalary",
      title: "기본급",
      width: "120px",
      render: (value: number) => `₩${value?.toLocaleString() || 0}`,
    },
    {
      key: "allowance",
      title: "수당",
      width: "120px",
      render: (value: number) => `₩${value?.toLocaleString() || 0}`,
    },
    {
      key: "employeeCount",
      title: "인원수",
      width: "80px",
      render: (value: number) => `${value}명`,
    },
    { key: "description", title: "설명" },
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
  ];

  // 통계 계산
  const totalPositions = positionData.length;
  const activePositions = positionData.filter(
    (pos) => pos.status === "활성",
  ).length;
  const totalEmployees = positionData.reduce(
    (sum, pos) => sum + pos.employeeCount,
    0,
  );
  const avgSalary = Math.round(
    positionData.reduce((sum, pos) => sum + pos.baseSalary, 0) / totalPositions,
  );

  return (
    <>
      {/* 메인 컨텐츠 */}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <i className="ri-user-star-line text-xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 직급</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPositions}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <i className="ri-check-line text-xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">활성 직급</p>
              <p className="text-2xl font-bold text-gray-900">
                {activePositions}
              </p>
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
              <p className="text-sm font-medium text-gray-600">평균 기본급</p>
              <p className="text-2xl font-bold text-gray-900">
                ₩{avgSalary.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 직급 관리 테이블 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">직급 목록</h2>
            <div className="flex space-x-3">
              <Button variant="outline">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
              <Button variant="default">
                <i className="ri-add-line mr-2"></i>새 직급 등록
              </Button>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Input
              placeholder="직급명, 코드, 구분으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              options={[
                { value: "전체", label: "전체 구분" },
                { value: "임원", label: "임원" },
                { value: "관리직", label: "관리직" },
                { value: "일반직", label: "일반직" },
              ]}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
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
            emptyText="조건에 맞는 직급이 없습니다"
          />
        </div>
      </div>
    </>
  );
}
