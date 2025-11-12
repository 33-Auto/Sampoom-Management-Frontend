import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import { useBranchesQuery } from "@/pages/master/branches/api";
import type { BranchResponseDTO } from "@/pages/master/branches/model";
import { BRANCH_STATUS, BRANCH_TYPE } from "@/pages/master/branches/model";
import { createKeyRecord } from "@/shared/lib/utils";
import { Badge, Button, SearchFilterBar, Table } from "@/shared/ui";

export const BranchMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

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

  const typeOptions = [
    { value: "", label: "전체 유형" },
    ...Object.entries(BRANCH_TYPE)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const typeLabels: Record<string, string> = {
          WAREHOUSE: "창고",
          FACTORY: "공장",
        };
        return {
          value: value as string,
          label: typeLabels[key] || key,
        };
      }),
  ];

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(BRANCH_STATUS)
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
    navigate("/master/branches/process");
  };

  const handleViewDetail = (row: BranchResponseDTO) => {
    navigate(`/master/branches/process/${row.id}`, {
      state: { branchData: row },
    });
  };

  const keys = createKeyRecord<BranchResponseDTO>(data?.data?.content ?? []);

  const columns = [
    { key: keys.branchCode, title: "지점 코드", width: "120px" },
    { key: keys.name, title: "지점명" },
    {
      key: keys.type,
      title: "유형",
      width: "120px",
      render: (value: string) => {
        const typeLabels: Record<string, string> = {
          WAREHOUSE: "창고",
          FACTORY: "공장",
        };
        return (
          <Badge variant={value === "WAREHOUSE" ? "default" : "warning"}>
            {typeLabels[value] || value}
          </Badge>
        );
      },
    },
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
      render: (_value: any, row: BranchResponseDTO) => {
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

  const branches = data?.data?.content ?? [];

  return (
    <>
      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="지점명 또는 코드 검색..."
        filters={[
          {
            key: "type",
            value: typeFilter,
            options: typeOptions,
            onChange: (e) => {
              setTypeFilter(e);
              onPageChange(0);
            },
          },
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
                setTypeFilter("");
                setStatusFilter("");
                onPageChange(0);
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
            <Button variant="default" onClick={handleCreateNew}>
              <i className="ri-add-line mr-2"></i>
              신규 등록
            </Button>
          </>
        }
      />

      {/* 지점 목록 테이블 */}
      <PaginationTableSection
        title="지점 목록"
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
          data={branches}
          loading={isLoading && data === undefined}
          emptyText={
            isLoading && data === undefined
              ? "데이터 로딩 중..."
              : "조건에 맞는 지점이 없습니다"
          }
          errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
        />
      </PaginationTableSection>
    </>
  );
};
