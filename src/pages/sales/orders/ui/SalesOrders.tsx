import { useMemo, useState } from "react";

import { queryClient } from "@/shared/api";
import { DEFAULT_WAREHOUSE_ID } from "@/shared/config/warehouse";
import {
  Button,
  Table,
  SearchFilterBar,
  TableSection,
  StatCard,
} from "@/shared/ui";

import { getSalesOrdersQueryOptions } from "../api/sales-orders.api";
import {
  SALES_ORDER_STATUS_FILTER_OPTIONS,
  SALES_ORDER_STATUS_LABELS,
  type SalesOrderDto,
  type SalesOrderStatus,
  type SalesOrderStatusFilterValue,
} from "../model";

type SalesOrderRow = {
  orderId: number;
  orderNumber: string;
  createdDate: string;
  agencyName: string;
  productName: string;
  totalQuantity: number;
  totalAmount: number;
  status: SalesOrderStatus;
};

const STATUS_BADGE_CLASS: Record<SalesOrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  DELAYED: "bg-orange-100 text-orange-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-sky-100 text-sky-800",
  DELIVERING: "bg-teal-100 text-teal-800",
  ARRIVED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELED: "bg-gray-100 text-gray-800",
};

const toDate = (iso?: string | null) =>
  iso ? new Date(iso).toISOString().slice(0, 10) : "-";

const mapOrderToRow = (order: SalesOrderDto): SalesOrderRow => {
  const items =
    order.items?.flatMap(
      (category) =>
        category.groups?.flatMap((group) => group.parts ?? []) ?? [],
    ) ?? [];

  const totalQuantity = items.reduce(
    (sum, part) => sum + (part?.quantity ?? 0),
    0,
  );
  const totalAmount = items.reduce(
    (sum, part) => sum + (part?.quantity ?? 0) * (part?.standardCost ?? 0),
    0,
  );

  const firstName = items.length > 0 ? (items[0]?.name ?? null) : null;
  const totalParts = items.length;
  const productName = firstName
    ? totalParts > 1
      ? `${firstName} 외 ${totalParts - 1}개`
      : firstName
    : "-";

  const status = (order.status ?? "PENDING") as SalesOrderStatus;

  return {
    orderId: order.orderId ?? 0,
    orderNumber: order.orderNumber ?? "-",
    createdDate: toDate(order.createdAt),
    agencyName: order.agencyName ?? "-",
    productName,
    totalQuantity,
    totalAmount,
    status,
  };
};

export const SalesOrders = () => {
  const [fromText, setFromText] = useState(""); // 고객사 필터
  const [statusFilter, setStatusFilter] =
    useState<SalesOrderStatusFilterValue>("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const warehouseId = DEFAULT_WAREHOUSE_ID;

  const queryOptions = useMemo(
    () =>
      getSalesOrdersQueryOptions({
        warehouseId,
        page,
        size,
        ...(fromText ? { from: fromText } : {}),
        ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
      }),
    [warehouseId, page, size, fromText, statusFilter],
  );

  const { data, refetch } = queryClient.useQuery(
    "get",
    "/api/order/warehouse/{warehouseId}",
    queryOptions,
    {
      placeholderData: (previousData) => previousData,
    },
  );
  const pageData = data?.data;
  const rawContent = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;
  const totalElements = pageData?.totalElements ?? 0;

  const orders = useMemo(
    () => rawContent.map((order) => mapOrderToRow(order)),
    [rawContent],
  );

  // 작업 버튼 - 취소/상세
  const statusFilterOptions = useMemo(
    () =>
      SALES_ORDER_STATUS_FILTER_OPTIONS.map((option) => ({
        ...option,
      })),
    [],
  );

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
      render: (value: SalesOrderStatus) => {
        const label = SALES_ORDER_STATUS_LABELS[value] ?? value;
        const className =
          STATUS_BADGE_CLASS[value] ?? "bg-gray-100 text-gray-800";
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${className}`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  // 통계 계산 (현재 페이지 기준 간단 집계)
  const totalOrders = totalElements;
  const { confirmedOrders, shippingOrPending, completedOrders } =
    useMemo(() => {
      const confirmed = orders.filter((o) => o.status === "CONFIRMED").length;
      const inProgress = orders.filter(
        (o) => o.status === "SHIPPING" || o.status === "PENDING",
      ).length;
      const completed = orders.filter((o) => o.status === "COMPLETED").length;
      return {
        confirmedOrders: confirmed,
        shippingOrPending: inProgress,
        completedOrders: completed,
      };
    }, [orders]);

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
            options: statusFilterOptions,
            onChange: (value: string) => {
              setStatusFilter(value as SalesOrderStatusFilterValue);
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
