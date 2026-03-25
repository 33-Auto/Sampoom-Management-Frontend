import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { useAgencyBranchOptions } from "@/entities/agency";
import { useBranchId, useBranchSelectionStore } from "@/features/branch-select";
import { Button, Table, SearchFilterBar, TableSection } from "@/shared/ui";

import { useSalesOrdersQuery, type SalesOrderListQueryParams } from "../api";
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
  const [fromAgencyId, setFromAgencyId] = useState(""); // 고객사 필터
  const [statusFilter, setStatusFilter] =
    useState<SalesOrderStatusFilterValue>("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const { defaultWarehouseId } = useLoaderData() as {
    defaultWarehouseId?: number;
  };
  const selectedWarehouseId = useBranchId("wms");
  const setBranchSelection = useBranchSelectionStore(
    (state) => state.setSelection,
  );
  const warehouseId = selectedWarehouseId
    ? Number(selectedWarehouseId)
    : undefined;

  const agencyOptions = useAgencyBranchOptions();
  const selectedAgencyOption = useMemo(
    () => agencyOptions.find((option) => option.value === fromAgencyId),
    [agencyOptions, fromAgencyId],
  );

  const queryParams = useMemo<SalesOrderListQueryParams | undefined>(() => {
    if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
      return undefined;
    }

    const params: SalesOrderListQueryParams = {
      warehouseId,
      page,
      size,
    };

    if (selectedAgencyOption?.value) {
      params.from = selectedAgencyOption.label;
    }

    if (statusFilter !== "ALL") {
      params.status = statusFilter as Exclude<
        SalesOrderStatusFilterValue,
        "ALL"
      >;
    }

    return params;
  }, [
    warehouseId,
    page,
    size,
    selectedAgencyOption?.label,
    selectedAgencyOption?.value,
    statusFilter,
  ]);

  const { data, refetch } = useSalesOrdersQuery(queryParams);
  const pageData = data?.data;
  const rawContent = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;
  const totalElements = pageData?.totalElements ?? 0;

  const orders = useMemo(
    () => rawContent.map((order) => mapOrderToRow(order)),
    [rawContent],
  );

  useEffect(() => {
    if (
      typeof defaultWarehouseId === "number" &&
      Number.isFinite(defaultWarehouseId)
    ) {
      const defaultIdString = String(defaultWarehouseId);
      if (!selectedWarehouseId) {
        setBranchSelection("wms", defaultIdString);
      }
    }
  }, [defaultWarehouseId, selectedWarehouseId, setBranchSelection]);

  useEffect(() => {
    setPage(0);
  }, [warehouseId, setPage]);

  // 작업 버튼 - 취소/상세
  const statusOptions = useMemo(
    () => [
      { value: "ALL", label: "전체 상태" },
      ...SALES_ORDER_STATUS_FILTER_OPTIONS.filter(
        (option) => option.value !== "ALL",
      ).map((option) => ({
        value: option.value,
        label: option.label,
      })),
    ],
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

  return (
    <>
      <div className="p-6">
        {/* 필터 및 검색 - 공통 컴포넌트 사용 */}
        <SearchFilterBar
          filters={[
            {
              key: "agency",
              value: fromAgencyId,
              options: agencyOptions,
              onChange: (value: string) => {
                setFromAgencyId(value);
                setPage(0);
              },
            },
            {
              key: "status",
              value: statusFilter,
              options: statusOptions,
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
    </>
  );
};
