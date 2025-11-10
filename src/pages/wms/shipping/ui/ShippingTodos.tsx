import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import {
  useBranchId,
  useBranchSelectionStore,
} from "@/features/branch-select/model/branch-selection.store";
import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import {
  type ShippingListQueryParams,
  useShippingListQuery,
} from "@/pages/wms/shipping/api/shipping-list.api";
import type {
  ShippingListParams,
  ShippingOrderDto,
  ShippingOrderItemDto,
} from "@/pages/wms/shipping/model";
import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
} from "@/shared/ui";

type ShippingStatus = NonNullable<ShippingListParams["status"]>;

const STATUS_CONFIG: Record<
  ShippingStatus,
  {
    label: string;
    variant: "default" | "info" | "success" | "warning" | "error";
  }
> = {
  PENDING: { label: "출고 대기", variant: "warning" },
  CONFIRMED: { label: "출고 확정", variant: "info" },
  SHIPPING: { label: "출고 진행", variant: "info" },
  DELIVERING: { label: "배송 중", variant: "info" },
  ARRIVED: { label: "도착", variant: "success" },
  COMPLETED: { label: "완료", variant: "success" },
  DELAYED: { label: "지연", variant: "error" },
  CANCELED: { label: "취소", variant: "error" },
  SHIPPED: { label: "출고 완료", variant: "success" },
};

const STATUS_OPTIONS: Array<{ value: ShippingStatus | ""; label: string }> = [
  { value: "", label: "전체 상태" },
  ...Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({
    value: value as ShippingStatus,
    label,
  })),
];

const isShippingStatus = (status: string): status is ShippingStatus =>
  Object.prototype.hasOwnProperty.call(STATUS_CONFIG, status);

const sumOrderQuantity = (items?: ShippingOrderItemDto[]) =>
  items?.reduce((acc, item) => acc + (item.orderQuantity ?? 0), 0) ?? 0;

const sumAvailableStock = (items?: ShippingOrderItemDto[]) =>
  items?.reduce((acc, item) => acc + (item.stock ?? 0), 0) ?? 0;

const formatNumber = (value: number) => value.toLocaleString("ko-KR");

export function ShippingTodos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ShippingStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const { page, size, onPageChange, onSizeChange, setPage } =
    usePaginationTable({});

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

  const categoryOptions = usePartCategoryOptions();
  const groupOptions = usePartGroupOptions(
    categoryFilter === "" ? 0 : Number(categoryFilter),
  );

  const queryParams = useMemo<ShippingListQueryParams | undefined>(() => {
    if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
      return undefined;
    }
    return {
      warehouseId,
      keyword: searchTerm === "" ? undefined : searchTerm,
      categoryId: categoryFilter === "" ? undefined : Number(categoryFilter),
      groupId: groupFilter === "" ? undefined : Number(groupFilter),
      status: statusFilter === "" ? undefined : statusFilter,
      page,
      size,
    };
  }, [
    warehouseId,
    searchTerm,
    categoryFilter,
    groupFilter,
    statusFilter,
    page,
    size,
  ]);

  const { data, isLoading, isError, refetch } =
    useShippingListQuery(queryParams);

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

  const orders = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const {
    totalOrderCount,
    pendingCount,
    inProgressCount,
    completedCount,
    shortageQuantity,
    totalRequestedQuantity,
  } = useMemo(() => {
    const pendingStatuses = new Set<ShippingStatus>(["PENDING"]);
    const inProgressStatuses = new Set<ShippingStatus>([
      "CONFIRMED",
      "SHIPPING",
      "DELIVERING",
    ]);
    const completedStatuses = new Set<ShippingStatus>(["COMPLETED", "ARRIVED"]);

    return orders.reduce(
      (acc, order) => {
        const orderQuantity = sumOrderQuantity(order.items);
        const availableStock = sumAvailableStock(order.items);
        const shortage = Math.max(orderQuantity - availableStock, 0);
        const status = (order.status ?? "") as ShippingStatus | "";

        acc.totalOrderCount += 1;
        acc.totalRequestedQuantity += orderQuantity;
        acc.shortageQuantity += shortage;

        if (status && pendingStatuses.has(status)) {
          acc.pendingCount += 1;
        } else if (status && inProgressStatuses.has(status)) {
          acc.inProgressCount += 1;
        } else if (status && completedStatuses.has(status)) {
          acc.completedCount += 1;
        }

        return acc;
      },
      {
        totalOrderCount: 0,
        pendingCount: 0,
        inProgressCount: 0,
        completedCount: 0,
        shortageQuantity: 0,
        totalRequestedQuantity: 0,
      },
    );
  }, [orders]);

  const columns = [
    {
      key: "orderNumber",
      title: "출고 번호",
      width: "140px",
      render: (value: string) => value ?? "-",
    },
    {
      key: "agencyName",
      title: "대상 대리점",
      render: (value: string) => value ?? "-",
    },
    {
      key: "items",
      title: "품목 수",
      width: "100px",
      render: (_: unknown, row: ShippingOrderDto) => row.items?.length ?? 0,
    },
    {
      key: "orderQuantity",
      title: "요청 수량",
      width: "140px",
      render: (_: unknown, row: ShippingOrderDto) =>
        `${formatNumber(sumOrderQuantity(row.items))} EA`,
    },
    {
      key: "availableStock",
      title: "가용 재고",
      width: "140px",
      render: (_: unknown, row: ShippingOrderDto) =>
        `${formatNumber(sumAvailableStock(row.items))} EA`,
    },
    {
      key: "status",
      title: "상태",
      width: "120px",
      render: (value: string | undefined) => {
        const config =
          value && isShippingStatus(value)
            ? STATUS_CONFIG[value]
            : {
                label: value ?? "-",
                variant: "default" as const,
              };
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "createdAt",
      title: "요청일",
      width: "140px",
      render: (value: string | undefined) =>
        value ? new Date(value).toLocaleDateString("ko-KR") : "-",
    },
  ];

  if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <InfoBox type="info" title="창고 선택 필요">
          <p className="text-sm">
            상단에서 창고를 선택하면 출고 요청 목록을 확인할 수 있습니다.
          </p>
        </InfoBox>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-truck-line"
          label="전체 출고 요청"
          value={totalElements || totalOrderCount}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-time-line"
          label="출고 대기"
          value={pendingCount}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-flight-takeoff-line"
          label="진행 중"
          value={inProgressCount}
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
      </div>

      <InfoBox type="info" title="WMS 출고 관리 안내">
        <p className="text-sm">
          출고 요청은 창고의 가용 재고를 기반으로 진행됩니다. 재고 부족분은
          자동으로 MRP/구매팀과 공유되어 보충 작업이 진행됩니다.
        </p>
      </InfoBox>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="출고 번호, 대리점, 품목명 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: STATUS_OPTIONS,
            onChange: (value: string) => {
              setStatusFilter(value as ShippingStatus | "");
              onPageChange(0);
            },
          },
          {
            key: "category",
            value: categoryFilter,
            options: categoryOptions,
            onChange: (value: string) => {
              setCategoryFilter(value);
              setGroupFilter("");
              onPageChange(0);
            },
          },
          {
            key: "group",
            value: groupFilter,
            options: groupOptions,
            onChange: (value: string) => {
              setGroupFilter(value);
              onPageChange(0);
            },
            disabled: categoryFilter === "",
          },
        ]}
        actions={
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setCategoryFilter("");
                setGroupFilter("");
                setPage(0);
              }}
            >
              <i className="ri-refresh-line mr-2" />
              초기화
            </Button>
          </div>
        }
      />

      <PaginationTableSection
        title="출고 요청 목록"
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
        actionsRight={
          <span className="text-sm text-gray-500 dark:text-grey-300">
            요청 수량 합계: {formatNumber(totalRequestedQuantity)} EA / 부족
            수량: {formatNumber(shortageQuantity)} EA
          </span>
        }
      >
        <Table
          columns={columns}
          data={orders}
          loading={isLoading && orders.length === 0}
          emptyText={
            isLoading && orders.length === 0
              ? "데이터 로딩 중..."
              : "조건에 맞는 출고 요청이 없습니다"
          }
          errorText={isError ? "출고 요청 데이터를 불러오지 못했습니다." : ""}
        />
      </PaginationTableSection>
    </div>
  );
}
