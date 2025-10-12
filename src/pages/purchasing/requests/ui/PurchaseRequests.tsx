import { useState } from "react";import { PaginationTableSection, usePaginationTable } from "@/features/table-pagination";import { usePurchaseRequestQuery } from "../api";import type { PurchaseOrderResponseDto, PurchaseRequestStatus, PurchaseRequestUrgency } from "@/pages/purchasing/requests/model";import { PURCHASE_REQUEST_STATUS, PURCHASE_REQUEST_URGENCY } from "../model";import { createKeyRecord } from "@/shared/lib";import { Badge, Button, SearchFilterBar, Table } from "@/shared/ui";export const PurchaseRequests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

  const { data, isLoading, isError, refetch } = usePurchaseRequestQuery({
    query: searchTerm === "" ? undefined : searchTerm,
    status:
      statusFilter === "" ? undefined : (statusFilter as PurchaseRequestStatus),
    urgency:
      urgencyFilter === ""
        ? undefined
        : (urgencyFilter as PurchaseRequestUrgency),
    page,
    size,
  });

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(PURCHASE_REQUEST_STATUS)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const statusLabels: Record<string, string> = {
          ORDERED: "주문됨",
          RECEIVED: "수령됨",
          CANCELED: "취소됨",
        };
        return {
          value: value as string,
          label: statusLabels[key] || key,
        };
      }),
  ];

  const urgencyOptions = [
    { value: "", label: "전체 긴급도" },
    ...Object.entries(PURCHASE_REQUEST_URGENCY)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const urgencyLabels: Record<string, string> = {
          HIGH: "높음",
          MEDIUM: "보통",
          LOW: "낮음",
        };
        return {
          value: value as string,
          label: urgencyLabels[key] || key,
        };
      }),
  ];

  const keys = createKeyRecord<PurchaseOrderResponseDto>(
    data?.data?.content ?? [],
  );

  const columns = [
    { key: keys.orderCode, title: "주문번호", width: "120px" },
    {
      key: keys.orderAt,
      title: "주문일",
      width: "120px",
      render: (value: string) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleDateString("ko-KR");
      },
    },
    { key: keys.factoryName, title: "공장명", width: "120px" },
    { key: keys.requesterName, title: "요청자", width: "100px" },
    {
      key: keys.requiredAt,
      title: "필요일",
      width: "100px",
      render: (value: string) => {
        if (!value) return "-";
        const date = new Date(value);
        return date.toLocaleDateString("ko-KR");
      },
    },
    {
      key: keys.urgency,
      title: "긴급도",
      width: "100px",
      render: (value: string) => {
        const getUrgencyVariant = (
          urgency: string,
        ): "error" | "warning" | "success" | "default" => {
          switch (urgency) {
            case "HIGH":
              return "error";
            case "MEDIUM":
              return "warning";
            case "LOW":
              return "success";
            default:
              return "default";
          }
        };
        const urgencyLabels: Record<string, string> = {
          HIGH: "높음",
          MEDIUM: "보통",
          LOW: "낮음",
        };
        return (
          <Badge variant={getUrgencyVariant(value)}>
            {urgencyLabels[value] || value}
          </Badge>
        );
      },
    },
    {
      key: keys.expectedAmount,
      title: "예상금액",
      width: "120px",
      render: (value: number) =>
        value ? `₩${Number(value).toLocaleString()}` : "-",
    },
    {
      key: keys.status,
      title: "상태",
      width: "100px",
      render: (value: string) => {
        const getStatusVariant = (
          status: string,
        ): "info" | "success" | "default" | "error" => {
          switch (status) {
            case "ORDERED":
              return "info";
            case "RECEIVED":
              return "success";
            case "CANCELED":
              return "error";
            default:
              return "default";
          }
        };
        const statusLabels: Record<string, string> = {
          ORDERED: "주문됨",
          RECEIVED: "수령됨",
          CANCELED: "취소됨",
        };
        return (
          <Badge variant={getStatusVariant(value)}>
            {statusLabels[value] || value}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="주문번호, 공장명, 요청자 검색..."
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
          {
            key: "urgency",
            value: urgencyFilter,
            options: urgencyOptions,
            onChange: (e) => {
              setUrgencyFilter(e);
              onPageChange(0);
            },
          },
        ]}
        actions={
          <>
            <Button variant="default" size="sm">
              <i className="ri-add-line mr-2"></i>
              신규 요청
            </Button>
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
          </>
        }
      />

      {/* 구매 요청 목록 테이블 */}
      <PaginationTableSection
        title="구매 요청 목록"
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
          data={data?.data?.content ?? []}
          loading={isLoading && data === undefined}
          emptyText={
            isLoading && data === undefined
              ? "데이터 로딩 중..."
              : "조건에 맞는 구매요청이 없습니다"
          }
          errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
        />
      </PaginationTableSection>
    </div>
  );
};
