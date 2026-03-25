import { useNavigate } from "react-router-dom";

import type { BranchResponseDTO } from "@/entities/branch";
import {
  MasterListLayout,
  useMasterListControls,
} from "@/features/master-list";
import { useBranchesQuery } from "@/pages/master/branches/api";
import {
  createBranchColumns,
  createBranchFilters,
} from "@/pages/master/branches/ui/masterListConfig";
import { createKeyRecord } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

export const BranchMaster = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    handleSearchChange,
    filters,
    handleFilterChange,
    resetAll,
    pagination,
  } = useMasterListControls([{ key: "type" }, { key: "status" }]);

  const typeFilter = filters.type ?? "";
  const statusFilter = filters.status ?? "";
  const { page, size, onPageChange, onSizeChange } = pagination;

  const { data, isLoading, isError, refetch } = useBranchesQuery({
    keyword: searchTerm === "" ? undefined : searchTerm,
    type:
      typeFilter === "" ? undefined : (typeFilter as "WAREHOUSE" | "FACTORY"),
    status:
      statusFilter === "" ? undefined : (statusFilter as "ACTIVE" | "INACTIVE"),
    page,
    size,
  });

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const handleCreateNew = () => {
    navigate("/master/branches/process");
  };

  const handleViewDetail = (row: BranchResponseDTO) => {
    navigate(`/master/branches/process/${row.id}`, {
      state: { branchData: row },
    });
  };

  const keys = createKeyRecord<BranchResponseDTO>(data?.data?.content ?? []);

  const columns = createBranchColumns({
    keys,
    onEdit: handleViewDetail,
  });
  const filtersConfig = createBranchFilters({
    typeValue: typeFilter,
    statusValue: statusFilter,
    onTypeChange: (value) => handleFilterChange("type", value),
    onStatusChange: (value) => handleFilterChange("status", value),
  });

  const branches = data?.data?.content ?? [];

  return (
    <MasterListLayout
      title="지점 목록"
      search={{
        term: searchTerm,
        onChange: handleSearchChange,
        placeholder: "지점명 또는 코드 검색...",
      }}
      filters={filtersConfig}
      actions={
        <>
          <Button variant="secondary" onClick={resetAll}>
            <i className="ri-refresh-line mr-2"></i>
            초기화
          </Button>
          <Button variant="default" onClick={handleCreateNew}>
            <i className="ri-add-line mr-2"></i>
            신규 등록
          </Button>
        </>
      }
      table={{
        columns,
        data: branches,
        loading: isLoading && data === undefined,
        emptyText:
          isLoading && data === undefined
            ? "데이터 로딩 중..."
            : "조건에 맞는 지점이 없습니다",
        errorText: isError ? "데이터 로딩 중 오류가 발생했습니다." : "",
      }}
      pagination={{
        totalElements,
        page,
        totalPages,
        size,
        onPageChange,
        onSizeChange,
        showRefresh: true,
        onRefresh: refetch,
      }}
    />
  );
};
