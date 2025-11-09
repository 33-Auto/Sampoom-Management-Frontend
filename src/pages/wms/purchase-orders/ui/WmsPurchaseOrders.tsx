import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import {
  STATUS_ORDER,
  normalizePurchaseOrderStatus,
} from "@/entities/purchase-order/lib/status";
import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import { usePurchaseOrderQuery } from "@/pages/wms/purchase-orders/api";
import type {
  POResDto,
  PurchaseOrderListParams,
  PurchaseOrderStatusKey,
} from "@/pages/wms/purchase-orders/model";
import {
  PURCHASE_ORDER_STATUS_BADGE_VARIANTS,
  PURCHASE_ORDER_STATUS_LABELS,
} from "@/pages/wms/purchase-orders/model";
import { DEFAULT_WAREHOUSE_ID } from "@/shared/config/warehouse";
import { formatCurrency, formatNumber } from "@/shared/lib/format/number";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  Table,
  StatCard,
  InfoBox,
  SearchFilterBar,
} from "@/shared/ui";

export function WmsPurchaseOrders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PurchaseOrderStatusKey | "">(
    "",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, setPage, onPageChange, onSizeChange } =
    usePaginationTable({});

  const { data, isLoading, isError, refetch } = usePurchaseOrderQuery({
    warehouseId: DEFAULT_WAREHOUSE_ID,
    keyword: searchTerm === "" ? undefined : searchTerm,
    categoryId: selectedCategory === "" ? undefined : Number(selectedCategory),
    groupId: selectedGroup === "" ? undefined : Number(selectedGroup),
    status:
      statusFilter === ""
        ? undefined
        : (statusFilter as PurchaseOrderListParams["status"]),
    page,
    size,
  });

  const orders = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const categoryOptions = usePartCategoryOptions();
  const groupOptions = usePartGroupOptions(
    selectedCategory === "" ? 0 : Number(selectedCategory),
  );

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...STATUS_ORDER.filter(
      (status, index, self) =>
        PURCHASE_ORDER_STATUS_LABELS[status] !== undefined &&
        self.indexOf(status) === index,
    ).map((status) => ({
      value: status,
      label: PURCHASE_ORDER_STATUS_LABELS[status],
    })),
  ];

  const {
    processingCount,
    completedCount,

    totalAmount,
  } = useMemo(() => {
    const processingStatuses = new Set<PurchaseOrderStatusKey>([
      "CONFIRMED",
      "PRODUCING",
      "IN_PROGRESS",
      "SHIPPING",
    ]);
    const completedStatuses = new Set<PurchaseOrderStatusKey>([
      "COMPLETED",
      "ARRIVED",
    ]);
    const canceledStatuses = new Set<PurchaseOrderStatusKey>(["CANCELED"]);

    return orders.reduce(
      (acc, order) => {
        const statusKey = normalizePurchaseOrderStatus(order.orderStatus);
        if (statusKey && processingStatuses.has(statusKey)) {
          acc.processingCount += 1;
        } else if (statusKey && completedStatuses.has(statusKey)) {
          acc.completedCount += 1;
        } else if (statusKey && canceledStatuses.has(statusKey)) {
          acc.canceledCount += 1;
        }

        acc.totalAmount += Number(order.price ?? 0);
        acc.totalOrderQuantity += Number(order.orderQuantity ?? 0);
        acc.totalInboundQuantity += Number(order.inboundQuantity ?? 0);
        acc.totalRestQuantity += Number(order.restQuantity ?? 0);

        return acc;
      },
      {
        processingCount: 0,
        completedCount: 0,
        canceledCount: 0,
        totalAmount: 0,
        totalOrderQuantity: 0,
        totalInboundQuantity: 0,
        totalRestQuantity: 0,
      },
    );
  }, [orders]);

  const getStatusBadge = (status?: string | null) => {
    const statusKey = normalizePurchaseOrderStatus(status);
    if (!statusKey) {
      return status ? <Badge variant="default">{status}</Badge> : null;
    }
    return (
      <Badge variant={PURCHASE_ORDER_STATUS_BADGE_VARIANTS[statusKey]}>
        {PURCHASE_ORDER_STATUS_LABELS[statusKey]}
      </Badge>
    );
  };

  const handleStocking = (row: POResDto) => {
    if (!row.purchaseOrderId) {
      return;
    }
    navigate(`/wms/orders/stocking/${row.purchaseOrderId}`, {
      state: {
        warehouseId: DEFAULT_WAREHOUSE_ID,
      },
    });
  };

  const keys = createKeyRecord<POResDto>(orders);
  const columns = [
    {
      key: keys.orderNumber ?? "orderNumber",
      title: "발주번호",
      width: "140px",
      render: (value: string | undefined) => value || "-",
    },
    {
      key: keys.partCode ?? "partCode",
      title: "품목코드",
      width: "120px",
      render: (value: string | undefined) => value || "-",
    },
    {
      key: keys.partName ?? "partName",
      title: "품목명",
      render: (value: string | undefined) => value || "-",
    },
    {
      key: "category",
      title: "카테고리",
      width: "220px",
      render: (_: unknown, row: POResDto) =>
        `${row.categoryName || "-"} > ${row.groupName || "-"}`,
    },
    {
      key: keys.orderQuantity ?? "orderQuantity",
      title: "발주수량",
      width: "120px",
      render: (value: number | undefined, row: POResDto) =>
        `${formatNumber(value ?? 0)} ${row.unit || ""}`,
    },
    {
      key: keys.inboundQuantity ?? "inboundQuantity",
      title: "입고수량",
      width: "120px",
      render: (value: number | undefined, row: POResDto) => {
        const inbound = value ?? 0;
        const className =
          inbound > 0
            ? "font-medium text-green-600 dark:text-green-400"
            : "text-gray-500 dark:text-grey-300";
        return (
          <span className={className}>
            {formatNumber(inbound)} {row.unit || ""}
          </span>
        );
      },
    },
    {
      key: keys.restQuantity ?? "restQuantity",
      title: "미입고수량",
      width: "120px",
      render: (value: number | undefined, row: POResDto) => {
        const restQty = value ?? 0;
        const className =
          restQty > 0
            ? "font-medium text-orange-600 dark:text-orange-400"
            : "text-gray-500 dark:text-grey-300";
        return (
          <span className={className}>
            {formatNumber(restQty)} {row.unit || ""}
          </span>
        );
      },
    },
    {
      key: keys.price ?? "price",
      title: "발주금액",
      width: "140px",
      render: (value: number | undefined) => formatCurrency(value ?? 0),
    },
    {
      key: keys.createdAt ?? "createdAt",
      title: "처리일",
      width: "120px",
      render: (value: string | null | undefined) =>
        value ? new Date(value).toLocaleDateString("ko-KR") : "-",
    },
    {
      key: keys.orderStatus ?? "orderStatus",
      title: "상태",
      width: "110px",
      render: (_: unknown, row: POResDto) => getStatusBadge(row.orderStatus),
    },
    {
      key: "actions",
      title: "작업",
      width: "100px",
      render: (_: unknown, row: POResDto) => (
        <div className="flex space-x-1">
          <Button
            variant="default"
            size="sm"
            disabled={!row.purchaseOrderId || (row.restQuantity ?? 0) <= 0}
            onClick={() => handleStocking(row)}
          >
            입고 처리
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 자동화 현황 대시보드 */}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-file-list-line"
            label="전체 발주"
            value={totalElements}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-time-line"
            label="진행 중"
            value={processingCount}
            iconBgColor="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          <StatCard
            icon="ri-check-line"
            label="완료"
            value={completedCount}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon="ri-money-dollar-circle-line"
            label="총 발주액"
            value={formatCurrency(totalAmount)}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* 실시간 모니터링 알림 */}
        <InfoBox
          type="info"
          title="발주 관리 시스템"
          children={
            <div className="flex-1">
              <p className="mt-1 text-sm">
                발주 현황을 모니터링하고 관리할 수 있습니다.
              </p>
            </div>
          }
        />

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setPage(0); // 검색 변경 시 1페이지로 이동
          }}
          searchPlaceholder="발주번호, 품목명 검색..."
          filters={[
            {
              key: "category",
              value: selectedCategory,
              options: categoryOptions,
              onChange: (e) => {
                setSelectedCategory(e);
                setSelectedGroup("");
                setPage(0);
              },
            },
            {
              key: "group",
              value: selectedGroup,
              options: groupOptions,
              onChange: (value) => {
                setSelectedGroup(value);
                setPage(0);
              },
              disabled: selectedCategory === "",
            },
            {
              key: "status",
              value: statusFilter,
              options: statusOptions,
              onChange: (value) => {
                setStatusFilter(value as PurchaseOrderStatusKey | "");
                setPage(0);
              },
            },
          ]}
          actions={
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedGroup("");
                  setStatusFilter("");
                  setPage(0);
                }}
              >
                <i className="ri-refresh-line mr-2"></i>
                초기화
              </Button>
            </div>
          }
        />

        {/* 발주 모니터링 테이블 */}
        <PaginationTableSection
          title="발주 모니터링"
          totalElements={totalElements}
          page={page}
          totalPages={totalPages}
          size={size}
          onSizeChange={onSizeChange}
          onPageChange={onPageChange}
          showRefresh
          onRefresh={async () => {
            await refetch();
          }}
        >
          <Table
            columns={columns}
            data={orders}
            loading={isLoading && orders.length === 0}
            emptyText={
              isLoading && orders.length === 0
                ? "데이터 로딩 중..."
                : "조건에 맞는 발주서가 없습니다"
            }
            errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
          />
        </PaginationTableSection>
      </div>
    </>
  );
}
