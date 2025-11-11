import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";

import {
  useBranchId,
  useBranchSelectionStore,
} from "@/features/branch-select/model/branch-selection.store";
import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import {
  usePartOrdersQuery,
  type PartOrdersQueryParams,
} from "@/pages/production/orders/api";
import {
  DEFAULT_PART_ORDER_STATUSES,
  PART_ORDER_PRIORITY_BADGE_VARIANTS,
  PART_ORDER_PRIORITY_LABELS,
  PART_ORDER_STATUS_BADGE_VARIANTS,
  PART_ORDER_STATUS_LABELS,
  type PartOrderPriority,
  type PartOrderResponseDTO,
  type PartOrderStatus,
} from "@/pages/production/orders/model";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  Modal,
  SearchFilterBar,
  StatCard,
  Table,
} from "@/shared/ui";

export const WorkOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    DEFAULT_PART_ORDER_STATUSES.join(","),
  );
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState<PartOrderResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});
  const { defaultFactoryId } = useLoaderData() as {
    defaultFactoryId?: number;
  };
  const selectedFactoryId = useBranchId("factory");
  const factoryId = selectedFactoryId ? Number(selectedFactoryId) : undefined;
  const setBranchSelection = useBranchSelectionStore(
    (state) => state.setSelection,
  );

  const selectedStatuses = useMemo<PartOrderStatus[]>(() => {
    if (statusFilter.trim().length === 0) {
      return [];
    }
    return statusFilter
      .split(",")
      .map((status) => status.trim())
      .filter(
        (status): status is PartOrderStatus =>
          status in PART_ORDER_STATUS_LABELS,
      );
  }, [statusFilter]);

  const selectedPriorities = useMemo<PartOrderPriority[]>(() => {
    const trimmed = priorityFilter.trim();
    if (trimmed.length === 0) {
      return [];
    }
    return trimmed in PART_ORDER_PRIORITY_LABELS
      ? [trimmed as PartOrderPriority]
      : [];
  }, [priorityFilter]);

  const queryParams = useMemo<PartOrdersQueryParams | undefined>(() => {
    if (typeof factoryId !== "number" || Number.isNaN(factoryId)) {
      return undefined;
    }
    return {
      factoryId,
      query: searchTerm === "" ? undefined : searchTerm,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      priorities:
        selectedPriorities.length > 0 ? selectedPriorities : undefined,
      page,
      size,
    };
  }, [factoryId, searchTerm, selectedStatuses, selectedPriorities, page, size]);

  const { data, isLoading, isError, refetch } = usePartOrdersQuery(queryParams);

  useEffect(() => {
    if (
      typeof defaultFactoryId === "number" &&
      Number.isFinite(defaultFactoryId)
    ) {
      const defaultIdString = String(defaultFactoryId);
      if (!selectedFactoryId) {
        setBranchSelection("factory", defaultIdString);
      }
    }
  }, [defaultFactoryId, selectedFactoryId, setBranchSelection]);

  useEffect(() => {
    if (typeof factoryId === "number" && Number.isFinite(factoryId)) {
      onPageChange(0);
    }
  }, [factoryId, onPageChange]);

  const orders = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const stats = useMemo(() => {
    const statusCounter = orders.reduce<Record<string, number>>(
      (acc, order) => {
        if (order.status) {
          acc[order.status] = (acc[order.status] ?? 0) + 1;
        }
        return acc;
      },
      {},
    );

    return {
      total: totalElements,
      inProgress: statusCounter.IN_PROGRESS ?? 0,
      completed: statusCounter.COMPLETED ?? 0,
      delayed: statusCounter.DELAYED ?? 0,
    };
  }, [orders, totalElements]);

  const statusOptions = [
    { value: "", label: "전체 상태" },
    {
      value: "IN_PROGRESS",
      label: "진행중",
    },
    {
      value: "COMPLETED",
      label: "완료",
    },
  ];

  const priorityOptions = [
    { value: "", label: "전체 우선순위" },
    ...Object.entries(PART_ORDER_PRIORITY_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const formatDate = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString("ko-KR");
  };

  const formatProgressRate = (value?: number | null) => {
    const normalized = Math.max(
      0,
      Math.min(100, Math.round((value ?? 0) * (value && value <= 1 ? 100 : 1))),
    );
    return normalized;
  };

  const formatItemsSummary = (
    items?: PartOrderResponseDTO["items"],
  ): string => {
    if (!items || items.length === 0) {
      return "-";
    }
    const [first, ...rest] = items;
    const firstLabel = first?.partName ?? first?.partCode ?? "-";
    if (rest.length === 0) {
      return firstLabel ?? "-";
    }
    return `${firstLabel ?? "-"} 외 ${rest.length}`;
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter(DEFAULT_PART_ORDER_STATUSES.join(","));
    setPriorityFilter("");
    onPageChange(0);
    refetch();
  };

  const handleViewDetails = (order: PartOrderResponseDTO) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const keys = createKeyRecord<PartOrderResponseDTO>(orders);

  const columns = [
    {
      key: keys.orderCode ?? "orderCode",
      title: "주문 코드",
      width: "160px",
      render: (value: string | undefined, row: PartOrderResponseDTO) =>
        value ?? row.orderId ?? "-",
    },
    {
      key: keys.factoryName ?? "factoryName",
      title: "공장",
      width: "150px",
      render: (value: string | undefined, row: PartOrderResponseDTO) =>
        value ?? row.warehouseName ?? "-",
    },
    {
      key: keys.items ?? "items",
      title: "품목",
      render: (
        _value: PartOrderResponseDTO["items"],
        row: PartOrderResponseDTO,
      ) => formatItemsSummary(row.items),
    },
    {
      key: keys.priority ?? "priority",
      title: "우선순위",
      width: "110px",
      render: (value: string | undefined) =>
        value ? (
          <Badge
            variant={PART_ORDER_PRIORITY_BADGE_VARIANTS[value] ?? "default"}
          >
            {PART_ORDER_PRIORITY_LABELS[value] ?? value}
          </Badge>
        ) : (
          "-"
        ),
    },
    {
      key: keys.progressRate ?? "progressRate",
      title: "진행률",
      width: "140px",
      render: (value: number | undefined) => {
        const percentage = formatProgressRate(value);
        return (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-500 dark:bg-main-400"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-200">
              {percentage}%
            </span>
          </div>
        );
      },
    },
    {
      key: keys.requiredDate ?? "requiredDate",
      title: "요청일",
      width: "120px",
      render: (value: string | undefined) => formatDate(value),
    },
    {
      key: keys.scheduledDate ?? "scheduledDate",
      title: "계획일",
      width: "120px",
      render: (value: string | undefined) => formatDate(value),
    },
    {
      key: keys.status ?? "status",
      title: "상태",
      width: "120px",
      render: (value: string | undefined) =>
        value ? (
          <Badge variant={PART_ORDER_STATUS_BADGE_VARIANTS[value] ?? "default"}>
            {PART_ORDER_STATUS_LABELS[value] ?? value}
          </Badge>
        ) : (
          "-"
        ),
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_value: unknown, row: PartOrderResponseDTO) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleViewDetails(row)}
        >
          <i className="ri-eye-line mr-1"></i>
          상세
        </Button>
      ),
    },
  ];

  if (typeof factoryId !== "number" || Number.isNaN(factoryId)) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          상단에서 공장을 선택하면 부품 주문 현황을 확인할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-file-list-line"
          label="전체 주문"
          value={stats.total}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-play-line"
          label="진행 중"
          value={stats.inProgress}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          icon="ri-check-line"
          label="완료"
          value={stats.completed}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon="ri-timer-flash-line"
          label="지연"
          value={stats.delayed}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="주문 코드, 공장명 등으로 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: (value) => {
              setStatusFilter(value);
              onPageChange(0);
            },
          },
          {
            key: "priority",
            value: priorityFilter,
            options: priorityOptions,
            onChange: (value) => {
              setPriorityFilter(value);
              onPageChange(0);
            },
          },
        ]}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
          </>
        }
      />

      <PaginationTableSection
        title="부품 주문 목록"
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
          data={orders}
          loading={isLoading && data === undefined}
          emptyText="조건에 맞는 부품 주문이 없습니다."
          errorText={
            isError ? "데이터 로딩 중 오류가 발생했습니다." : undefined
          }
        />
      </PaginationTableSection>

      <Modal
        open={isModalOpen && selectedOrder !== null}
        onClose={handleCloseModal}
        title="부품 상세"
        widthClassName="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    주문 코드
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedOrder.orderCode ?? selectedOrder.orderId ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    공장
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedOrder.factoryName ??
                      selectedOrder.warehouseName ??
                      "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    상태
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedOrder.status
                      ? (PART_ORDER_STATUS_LABELS[selectedOrder.status] ??
                        selectedOrder.status)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    우선순위
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedOrder.priority
                      ? (PART_ORDER_PRIORITY_LABELS[selectedOrder.priority] ??
                        selectedOrder.priority)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                부품 목록
              </h4>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                          부품명
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                          부품코드
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                          수량
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={item?.partId ?? index}>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            {item?.partName ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {item?.partCode ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-gray-100">
                            {item?.quantity ?? "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-300">
                  등록된 부품 정보가 없습니다.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={handleCloseModal}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
