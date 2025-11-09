import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Table,
  SearchFilterBar,
  TableSection,
  StatCard,
} from "@/shared/ui";

import {
  useSalesOrdersQuery,
  useCancelOrderMutation,
} from "../api/sales-orders.api";

// 판매 주문 데이터는 API로부터 조회

export const SalesOrders = () => {
  const navigate = useNavigate();
  const [fromText, setFromText] = useState(""); // 고객사 필터
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const warehouseId = 1;

  const statusLabelMap: Record<string, string> = {
    PENDING: "대기 중",
    CONFIRMED: "주문 확인",
    SHIPPING: "배송 중",
    DELAYED: "배송 지연",
    PRODUCING: "생산 중",
    COMPLETED: "배송 완료",
    CANCELED: "주문 취소",
  };

  const statusOptions = [
    { value: "ALL", label: "전체 상태" },
    { value: "PENDING", label: "대기 중" },
    { value: "CONFIRMED", label: "주문 확인" },
    { value: "SHIPPING", label: "배송 중" },
    { value: "DELAYED", label: "배송 지연" },
    { value: "PRODUCING", label: "생산 중" },
    { value: "COMPLETED", label: "배송 완료" },
    { value: "CANCELED", label: "주문 취소" },
  ];

  // 우선순위는 추후 확장 예정

  const { data, refetch } = useSalesOrdersQuery({
    warehouseId,
    page,
    size,
    ...(fromText ? { from: fromText } : {}),
    ...(statusFilter !== "ALL" ? { status: statusFilter as any } : {}),
  });
  const orders = data?.orders ?? [];
  const rawContent = data?.rawContent ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  // 작업 버튼 - 취소/상세
  const cancelMutation = useCancelOrderMutation();

  const columns = [
    { key: "orderNumber", title: "주문번호", width: "160px" },
    { key: "createdDate", title: "주문일", width: "110px" },
    { key: "agencyName", title: "고객사" },
    { key: "productName", title: "제품명" },
    {
      key: "totalQuantity",
      title: "수량",
      width: "80px",
      render: (value: number) => `${value}개`,
    },
    {
      key: "totalAmount",
      title: "주문 금액",
      width: "140px",
      render: (value: number) =>
        typeof value === "number" ? `₩${value.toLocaleString()}` : "-",
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : value === "CONFIRMED"
                ? "bg-blue-100 text-blue-800"
                : value === "SHIPPING"
                  ? "bg-indigo-100 text-indigo-800"
                  : value === "DELAYED"
                    ? "bg-orange-100 text-orange-800"
                    : value === "PRODUCING"
                      ? "bg-purple-100 text-purple-800"
                      : value === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
          }`}
        >
          {statusLabelMap[value] || value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "작업",
      width: "220px",
      render: (_: any, row: any) => (
        <div className="flex items-center gap-1">
          <Button
            variant="destructive"
            size="sm"
            className="cursor-pointer"
            disabled={cancelMutation.isPending || row.status !== "PENDING"}
            onClick={async () => {
              await cancelMutation.mutateAsync(row.orderId);
              await refetch();
            }}
          >
            취소
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              const full = rawContent.find((r) => r.orderId === row.orderId);
              navigate(`/sales/orders/${row.orderId}`, {
                state: { order: full },
              });
            }}
          >
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산 (현재 페이지 기준 간단 집계)
  const totalOrders = totalElements;
  const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED").length;
  const shippingOrPending = orders.filter(
    (o) => o.status === "SHIPPING" || o.status === "PENDING",
  ).length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;

  return (
    <div className="p-6">
      {/* 통계 카드 - 공통 StatCard 사용 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-file-list-line"
          label="전체 주문"
          value={totalOrders}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="ri-notification-line"
          label="확인된 주문"
          value={confirmedOrders}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />

        <StatCard
          icon="ri-time-line"
          label="진행 중(PENDING/SHIPPING)"
          value={shippingOrPending}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />

        <StatCard
          icon="ri-check-double-line"
          label="완료된 주문"
          value={completedOrders}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* 필터 및 검색 - 공통 컴포넌트 사용 */}
      <SearchFilterBar
        searchTerm={fromText}
        onSearchChange={(v) => {
          setFromText(v);
          setPage(0);
        }}
        searchPlaceholder="고객사(From) 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: (v: string) => {
              setStatusFilter(v);
              setPage(0);
            },
          },
        ]}
      />

      {/* 주문 목록 테이블 - TableSection 사용 */}
      <TableSection
        title="판매 주문 목록"
        metaRight={
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>
              총 {totalElements}개 / 페이지 {page + 1} /{" "}
              {Math.max(totalPages, 1)}
            </span>
            <select
              className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-xs"
              value={size}
              onChange={(e) => {
                setSize(Number(e.target.value));
                setPage(0);
              }}
            >
              {[10, 20, 50].map((s) => (
                <option key={s} value={s}>
                  {s}/page
                </option>
              ))}
            </select>
          </div>
        }
        actionsRight={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => refetch()}
            >
              <i className="ri-refresh-line mr-2"></i>
              새로고침
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page <= 0}
              >
                이전
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setPage((p) =>
                    totalPages ? Math.min(totalPages - 1, p + 1) : p + 1,
                  )
                }
                disabled={totalPages ? page >= totalPages - 1 : false}
              >
                다음
              </Button>
            </div>
          </div>
        }
      >
        <Table
          columns={columns}
          data={orders}
          emptyText="조건에 맞는 주문이 없습니다"
        />
      </TableSection>
    </div>
  );
};
