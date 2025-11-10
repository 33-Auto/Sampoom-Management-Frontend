import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";

import { normalizeInventoryStatus } from "@/entities/inventory/lib/status";
import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import {
  useBranchId,
  useBranchSelectionStore,
} from "@/features/branch-select/model/branch-selection.store";
import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import {
  type InventoryListQueryParams,
  useWarehouseInventoryQuery,
} from "@/pages/wms/inventory/api";
import type {
  InventoryStatusKey,
  PartResDto,
} from "@/pages/wms/inventory/model";
import {
  INVENTORY_STATUS_BADGE_VARIANTS,
  INVENTORY_STATUS_LABELS,
} from "@/pages/wms/inventory/model";
import { formatCurrency, formatNumber } from "@/shared/lib/format/number";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
} from "@/shared/ui";

export const InventoryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<InventoryStatusKey | "">("");

  // Pagination 처리를 위한 커스텀 훅
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

  const queryParams = useMemo<InventoryListQueryParams | undefined>(() => {
    if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
      return undefined;
    }
    return {
      warehouseId,
      keyword: searchTerm === "" ? undefined : searchTerm,
      categoryId: categoryFilter === "" ? undefined : Number(categoryFilter),
      groupId: groupFilter === "" ? undefined : Number(groupFilter),
      quantityStatus: statusFilter === "" ? undefined : statusFilter,
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
    useWarehouseInventoryQuery(queryParams);

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

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;
  const items = data?.data?.content ?? [];

  const { reorderPointCount, dangerCount, totalInventoryValue } =
    useMemo(() => {
      return items.reduce(
        (acc, item) => {
          const quantity = item.quantity ?? 0;
          const rop = item.rop ?? 0;
          const statusKey = normalizeInventoryStatus(item.status);
          if (quantity <= rop) {
            acc.reorderPointCount += 1;
          }
          if (statusKey === "DANGER") {
            acc.dangerCount += 1;
          }
          acc.totalInventoryValue += Number(item.partValue ?? 0);
          acc.totalQuantity += quantity;
          return acc;
        },
        {
          reorderPointCount: 0,
          dangerCount: 0,
          totalInventoryValue: 0,
          totalQuantity: 0,
        },
      );
    }, [items]);

  const categoryOptions = usePartCategoryOptions();

  const groupOptions = usePartGroupOptions(
    categoryFilter === "" ? 0 : Number(categoryFilter),
  );

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(INVENTORY_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  // const filteredData =
  //   apiResponse?.data?.filter((item: PartResDto) => {
  //     const matchesSearch =
  //       item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       item.name?.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesCategory =
  //       categoryFilter === "전체" || item.category === categoryFilter;
  //     const matchesStatus =
  //       statusFilter === "전체" || item.status === statusFilter;
  //     return matchesSearch && matchesCategory && matchesStatus;
  //   }) || [];

  const keys = createKeyRecord<PartResDto>(items);
  const columns = [
    { key: keys.code ?? "code", title: "품목코드", width: "120px" },
    { key: keys.name ?? "name", title: "품목명" },
    {
      key: "category",
      title: "카테고리",
      width: "250px",
      render: (_value: string, row: PartResDto) =>
        `${row.category || "-"} > ${row.group || "-"}`,
    },
    {
      key: keys.quantity ?? "quantity",
      title: "현재고",
      width: "100px",
      render: (value: number | undefined, row: PartResDto) => {
        const quantity = value ?? 0;
        const rop = row.rop ?? 0;
        const className =
          quantity <= rop
            ? "font-semibold text-red-600"
            : quantity <= rop * 1.2
              ? "font-semibold text-yellow-600"
              : "text-gray-900 dark:text-grey-100";
        return (
          <span className={className}>
            {formatNumber(quantity)} {row.unit || "EA"}
          </span>
        );
      },
    },
    {
      key: keys.rop ?? "rop",
      title: "재주문점",
      width: "100px",
      render: (value: number | undefined, row: PartResDto) =>
        `${formatNumber(value ?? 0)} ${row.unit || "EA"}`,
    },
    {
      key: keys.status ?? "status",
      title: "상태",
      width: "100px",
      render: (value: string | undefined) => {
        const statusKey = normalizeInventoryStatus(value);
        const label = statusKey
          ? INVENTORY_STATUS_LABELS[statusKey]
          : (value ?? "-");
        const variant = statusKey
          ? INVENTORY_STATUS_BADGE_VARIANTS[statusKey]
          : "default";
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    {
      key: keys.partValue ?? "partValue",
      title: "재고가치",
      width: "120px",
      render: (value: number | undefined) => formatCurrency(value ?? 0),
    },
    // {
    //   key: "actions",
    //   title: "작업",
    //   width: "150px",
    //   render: (value: any, row: PartResDto) => (
    //     <div className="flex space-x-1">
    //       <Button
    //         variant="default"
    //         size="sm"
    //         onClick={() => handleStockMovement(row.code || "Error", "in")}
    //       >
    //         입고
    //       </Button>
    //       {/* <Button
    //         variant="secondary"
    //         size="sm"
    //         onClick={() => handleLocationUpdate(row.code || "Error")}
    //       >
    //         이동
    //       </Button> */}
    //     </div>
    //   ),
    // },
  ];

  // const totalItems = apiResponse?.data?.length ?? 0;
  // const lowStockItems =
  //   apiResponse?.data?.filter(
  //     (item: PartResDto) => (item.quantity || -1) <= (item.rop || 0),
  //   ).length ?? 0;
  // const criticalItems = apiResponse?.data!.filter(
  //   (item) => item.currentStock <= item.safetyStock,
  // ).length;
  // const totalValue =
  //   apiResponse?.data!.reduce(
  //     (sum, item) => sum + Number(item.partValue!),
  //     0,
  //   ) || 0;

  if (typeof warehouseId !== "number" || Number.isNaN(warehouseId)) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <InfoBox type="info" title="창고 선택 필요">
          <p className="text-sm">
            상단에서 창고를 선택하면 재고 현황을 확인할 수 있습니다.
          </p>
        </InfoBox>
      </div>
    );
  }

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-stack-line"
            label="전체 품목"
            value={totalElements}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-recycle-line"
            label="재주문점 이하"
            value={reorderPointCount}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
          />
          <StatCard
            icon="ri-alert-line"
            label="위험 재고"
            value={dangerCount}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <StatCard
            icon="ri-money-dollar-circle-line"
            label="총 재고가치"
            value={formatCurrency(totalInventoryValue)}
            iconBgColor="bg-emerald-100"
            iconColor="text-emerald-600"
          />
        </div>

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            onPageChange(0);
          }}
          searchPlaceholder="품목코드, 품목명 검색..."
          filters={[
            {
              key: "category",
              value: categoryFilter,
              options: categoryOptions,
              onChange: (e) => {
                setCategoryFilter(e);
                setGroupFilter("");
                onPageChange(0);
              },
            },
            {
              key: "group",
              value: groupFilter,
              options: groupOptions,
              onChange: (e) => {
                setGroupFilter(e);
                onPageChange(0);
              },
              disabled: categoryFilter === "",
            },

            {
              key: "status",
              value: statusFilter,
              options: statusOptions,
              onChange: (value: string) => {
                setStatusFilter(value as InventoryStatusKey | "");
                onPageChange(0);
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
                  setCategoryFilter("");
                  setGroupFilter("");
                  setStatusFilter("");
                  setPage(0);
                }}
              >
                <i className="ri-refresh-line mr-2" />
                초기화
              </Button>
            </div>
          }
        />

        {/* 재고 현황 테이블 */}
        <PaginationTableSection
          title="재고 현황"
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
            data={items}
            loading={isLoading && items.length === 0}
            emptyText={
              isLoading && items.length === 0
                ? "데이터 로딩 중..."
                : "조건에 맞는 재고가 없습니다"
            }
            errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
          />
        </PaginationTableSection>

        {/* WMS 역할 안내 */}
        <InfoBox type="info" title="WMS 시스템 역할">
          <p className="mt-1 text-sm">
            WMS는 재고의 물리적 위치와 이동을 관리하며, 재고 변경 사항을 ERP
            시스템에 보고합니다. 생산 계획 및 구매 결정은 ERP의 MRP 모듈에서
            담당합니다.
          </p>
        </InfoBox>
      </div>
    </>
  );
};
