import {
  MasterListLayout,
  useMasterListControls,
} from "@/features/master-list";
import { Button } from "@/shared/ui";

import {
  createPositionFilters,
  positionColumns,
  type PositionRecord,
} from "./masterListConfig";

export const PositionMaster = () => {
  const {
    searchTerm,
    handleSearchChange,
    filters,
    handleFilterChange,
    pagination,
  } = useMasterListControls([{ key: "category", initialValue: "전체" }]);

  const levelFilter = filters.category ?? "전체";
  const { page, size, onPageChange, onSizeChange } = pagination;

  // 직급 데이터
  const positionData: PositionRecord[] = [
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

  const totalElements = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const paginatedData = filteredData.slice(page * size, page * size + size);

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
    <MasterListLayout
      title="직급 목록"
      headerSlot={
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
      }
      search={{
        term: searchTerm,
        onChange: handleSearchChange,
        placeholder: "직급명, 코드, 구분으로 검색...",
      }}
      filters={createPositionFilters({
        categoryValue: levelFilter,
        onCategoryChange: (value) => handleFilterChange("category", value),
      })}
      actions={
        <>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSearchChange("")}
          >
            <i className="ri-refresh-line mr-2"></i>
            새로고침
          </Button>
          <Button variant="outline">
            <i className="ri-download-line mr-2"></i>
            내보내기
          </Button>
          <Button variant="default">
            <i className="ri-add-line mr-2"></i>새 직급 등록
          </Button>
        </>
      }
      table={{
        columns: positionColumns,
        data: paginatedData,
        emptyText: "조건에 맞는 직급이 없습니다",
      }}
      pagination={{
        totalElements,
        page,
        totalPages,
        size,
        onPageChange,
        onSizeChange,
      }}
    />
  );
};
