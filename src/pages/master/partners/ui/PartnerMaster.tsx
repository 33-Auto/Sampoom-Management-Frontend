import { useNavigate } from "react-router-dom";import { MasterListLayout, useMasterListControls } from "@/features/master-list";import { usePartnersQuery } from "../api";import type { PartnerResponseDTO } from "@/pages/master/partners/model";import { createPartnerColumns, createPartnerFilters } from "./masterListConfig";import { createKeyRecord } from "@/shared/lib";import { Button } from "@/shared/ui";export const PartnerMaster = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    handleSearchChange,
    filters,
    handleFilterChange,
    resetAll,
    pagination,
  } = useMasterListControls([{ key: "status" }]);

  const statusFilter = filters.status ?? "";
  const { page, size, onPageChange, onSizeChange } = pagination;

  const { data, isLoading, isError, refetch } = usePartnersQuery({
    keyword: searchTerm === "" ? undefined : searchTerm,
    status:
      statusFilter === "" ? undefined : (statusFilter as "ACTIVE" | "INACTIVE"),
    page,
    size,
  });

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const handleCreateNew = () => {
    navigate("/master/partners/process");
  };

  const handleViewDetail = (row: PartnerResponseDTO) => {
    navigate(`/master/partners/process/${row.id}`, {
      state: { partnerData: row },
    });
  };

  const keys = createKeyRecord<PartnerResponseDTO>(data?.data?.content ?? []);

  const columns = createPartnerColumns({
    keys,
    onEdit: handleViewDetail,
  });
  const filtersConfig = createPartnerFilters({
    statusValue: statusFilter,
    onStatusChange: (value) => handleFilterChange("status", value),
  });

  const partners = data?.data?.content ?? [];

  return (
    <MasterListLayout
      title="거래처 목록"
      search={{
        term: searchTerm,
        onChange: handleSearchChange,
        placeholder: "거래처명 또는 코드 검색...",
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
        data: partners,
        loading: isLoading && data === undefined,
        emptyText:
          isLoading && data === undefined
            ? "데이터 로딩 중..."
            : "조건에 맞는 거래처가 없습니다",
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
