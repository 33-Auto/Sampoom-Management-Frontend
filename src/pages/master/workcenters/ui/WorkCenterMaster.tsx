import { useNavigate } from "react-router-dom";

import type {
  WorkCenterResponseDTO,
  WorkCenterType,
} from "@/entities/workcenter";
import { useWorkCentersQuery } from "@/entities/workcenter";
import {
  MasterListLayout,
  useMasterListControls,
} from "@/features/master-list";
import {
  createWorkCenterColumns,
  createWorkCenterFilters,
  WorkCenterCapacityInfo,
} from "@/pages/master/workcenters/ui/masterListConfig";
import { createKeyRecord } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

export const WorkCenterMaster = () => {
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

  const { data, isLoading, isError, refetch } = useWorkCentersQuery({
    query: searchTerm === "" ? undefined : searchTerm,
    type: typeFilter === "" ? undefined : (typeFilter as WorkCenterType),
    status:
      statusFilter === "" || statusFilter === "MAINTENANCE"
        ? undefined
        : (statusFilter as "ACTIVE" | "INACTIVE"),
    page,
    size,
  });

  const responseData = data?.data;
  const isDataValid = responseData && typeof responseData !== "string";

  const totalElements = isDataValid ? (responseData.totalElements ?? 0) : 0;
  const totalPages = isDataValid ? (responseData.totalPages ?? 0) : 0;

  const handleCreateNew = () => {
    navigate("/master/workcenters/process");
  };

  const handleViewDetail = (row: WorkCenterResponseDTO) => {
    navigate(`/master/workcenters/process/${row.id}`, {
      state: { workCenterData: row },
    });
  };

  const content = isDataValid ? (responseData.content ?? []) : [];
  const keys = createKeyRecord<WorkCenterResponseDTO>(content);

  const columns = createWorkCenterColumns({
    keys,
    onEdit: handleViewDetail,
  });
  const filterConfigs = createWorkCenterFilters({
    typeValue: typeFilter,
    statusValue: statusFilter,
    onTypeChange: (value) => handleFilterChange("type", value),
    onStatusChange: (value) => handleFilterChange("status", value),
  });

  const workCenters = content;

  return (
    <MasterListLayout
      title="작업장 목록"
      headerSlot={<WorkCenterCapacityInfo onCreate={handleCreateNew} />}
      search={{
        term: searchTerm,
        onChange: handleSearchChange,
        placeholder: "작업장명 또는 코드 검색...",
      }}
      filters={filterConfigs}
      actions={
        <>
          <Button variant="secondary" size="sm" onClick={resetAll}>
            <i className="ri-refresh-line mr-2"></i>
            초기화
          </Button>
          <Button variant="secondary" size="sm">
            <i className="ri-download-line mr-2"></i>
            내보내기
          </Button>
        </>
      }
      table={{
        columns,
        data: workCenters,
        loading: isLoading && data === undefined,
        emptyText:
          isLoading && data === undefined
            ? "데이터 로딩 중..."
            : "조건에 맞는 작업장이 없습니다",
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
