import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import { usePartnersQuery } from "@/pages/master/partners/api";
import type { PartnerResponseDTO } from "@/pages/master/partners/model";
import { PARTNER_STATUS } from "@/pages/master/partners/model";
import { createKeyRecord } from "@/shared/lib/utils";
import { Badge, Button, SearchFilterBar, Table } from "@/shared/ui";

export const PartnerMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

  const { data, isLoading, isError, refetch } = usePartnersQuery({
    keyword: searchTerm === "" ? undefined : searchTerm,
    status:
      statusFilter === "" ? undefined : (statusFilter as "ACTIVE" | "INACTIVE"),
    page,
    size,
  });

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(PARTNER_STATUS)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const statusLabels: Record<string, string> = {
          ACTIVE: "활성",
          INACTIVE: "비활성",
        };
        return {
          value: value as string,
          label: statusLabels[key] || key,
        };
      }),
  ];

  const handleCreateNew = () => {
    navigate("/master/partners/process");
  };

  const handleViewDetail = (row: PartnerResponseDTO) => {
    navigate(`/master/partners/process/${row.id}`, {
      state: { partnerData: row },
    });
  };

  const keys = createKeyRecord<PartnerResponseDTO>(data?.data?.content ?? []);

  const columns = [
    { key: keys.vendorCode, title: "거래처 코드", width: "120px" },
    { key: keys.name, title: "거래처명" },
    { key: keys.businessNumber, title: "사업자번호", width: "130px" },
    { key: keys.ceoName, title: "대표자", width: "100px" },
    { key: keys.address, title: "주소" },
    {
      key: keys.status,
      title: "상태",
      width: "80px",
      render: (value: string) => {
        const statusLabels: Record<string, string> = {
          ACTIVE: "활성",
          INACTIVE: "비활성",
        };
        const getStatusVariant = (
          status: string,
        ): "success" | "default" | "error" | "warning" => {
          switch (status) {
            case "ACTIVE":
              return "success";
            case "INACTIVE":
              return "default";
            default:
              return "default";
          }
        };
        return (
          <Badge variant={getStatusVariant(value)}>
            {statusLabels[value] || value}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_value: any, row: PartnerResponseDTO) => {
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetail(row)}
          >
            <i className="ri-edit-line mr-1"></i>
            편집
          </Button>
        );
      },
    },
  ];

  const partners = data?.data?.content ?? [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="거래처명 또는 코드 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: (e) => {
              setStatusFilter(e);
              onPageChange(0);
            },
          },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                onPageChange(0);
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
            {/* 신규 등록 버튼 */}

            <Button variant="default" onClick={handleCreateNew}>
              <i className="ri-add-line mr-2"></i>
              신규 등록
            </Button>
          </>
        }
      />

      {/* 거래처 목록 테이블 */}
      <PaginationTableSection
        title="거래처 목록"
        totalElements={totalElements}
        page={page}
        totalPages={totalPages}
        size={size}
        onSizeChange={onSizeChange}
        onPageChange={onPageChange}
        showRefresh
        onRefresh={refetch}
      >
        <Table
          columns={columns}
          data={partners}
          loading={isLoading && data === undefined}
          emptyText={
            isLoading && data === undefined
              ? "데이터 로딩 중..."
              : "조건에 맞는 거래처가 없습니다"
          }
          errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
        />
      </PaginationTableSection>
    </div>
  );
};
