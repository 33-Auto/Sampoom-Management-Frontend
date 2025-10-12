import { useEffect, useMemo, useState } from "react";import { useLoaderData, useNavigate } from "react-router-dom";import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";import { STATUS_ORDER, normalizePurchaseOrderStatus } from "@/entities/purchase-order";import { useBranchId, useBranchSelectionStore } from "@/features/branch-select";import { PaginationTableSection, usePaginationTable } from "@/features/table-pagination";import { type PurchaseOrderListQueryParams, usePurchaseOrderQuery } from "../api";import type { POResDto, PurchaseOrderListParams, PurchaseOrderStatusKey } from "@/pages/wms/purchase-orders/model";import { PURCHASE_ORDER_STATUS_BADGE_VARIANTS, PURCHASE_ORDER_STATUS_LABELS } from "../model";import { createKeyRecord, formatCurrency, formatNumber } from "@/shared/lib";import { Badge, Button, InfoBox, SearchFilterBar, Table } from "@/shared/ui";export function WmsPurchaseOrders() {
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

  const queryParams = useMemo<PurchaseOrderListQueryParams | undefined>(() => {
    if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
      return undefined;
    }
    return {
      warehouseId,
      keyword: searchTerm === "" ? undefined : searchTerm,
      categoryId:
        selectedCategory === "" ? undefined : Number(selectedCategory),
      groupId: selectedGroup === "" ? undefined : Number(selectedGroup),
      status:
        statusFilter === ""
          ? undefined
          : (statusFilter as PurchaseOrderListParams["status"]),
      page,
      size,
    };
  }, [
    warehouseId,
    searchTerm,
    selectedCategory,
    selectedGroup,
    statusFilter,
    page,
    size,
  ]);

  const { data, isLoading, isError, refetch } =
    usePurchaseOrderQuery(queryParams);

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
    if (typeof warehouseId !== "number") {
      return;
    }
    navigate(`/wms/orders/stocking/${row.purchaseOrderId}`, {
      state: {
        warehouseId,
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

  if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <InfoBox type="info" title="창고 선택 필요">
          <p className="text-sm">
            상단에서 창고를 선택하면 발주 현황을 확인할 수 있습니다.
          </p>
        </InfoBox>
      </div>
    );
  }

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 자동화 현황 대시보드 */}

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
