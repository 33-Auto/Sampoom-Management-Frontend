import { MasterListLayout, useMasterListControls } from "@/features/master-list";import { Button } from "@/shared/ui";import { createDepartmentFilters, departmentColumns, type DepartmentRecord } from "./masterListConfig";export const DepartmentMaster = () => {
  const {
    searchTerm,
    handleSearchChange,
    filters,
    handleFilterChange,
    pagination,
  } = useMasterListControls([{ key: "status", initialValue: "전체" }]);

  const statusFilter = filters.status ?? "전체";
  const { page, size, onPageChange, onSizeChange } = pagination;

  // 부서 데이터
  const departmentData: DepartmentRecord[] = [
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

  const totalElements = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const paginatedData = filteredData.slice(page * size, page * size + size);

  const filtersConfig = createDepartmentFilters({
    statusValue: statusFilter,
    onStatusChange: (value) => handleFilterChange("status", value),
  });

  return (
    <MasterListLayout
      title="부서 목록"
      search={{
        term: searchTerm,
        onChange: handleSearchChange,
        placeholder: "부서명, 코드, 부서장으로 검색...",
      }}
      filters={filtersConfig}
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
      table={{
        columns: departmentColumns,
        data: paginatedData,
        emptyText: "조건에 맞는 부서가 없습니다",
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
