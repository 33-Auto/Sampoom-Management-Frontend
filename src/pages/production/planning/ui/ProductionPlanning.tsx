import { useMemo, useState } from "react";

import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import { useProductionPlansQuery } from "@/pages/production/planning/api";
import {
  DEFAULT_FACTORY_ID,
  DEFAULT_INCLUDE_RECENT_DAYS,
  PRODUCTION_PLAN_PRIORITY_BADGE_VARIANTS,
  PRODUCTION_PLAN_PRIORITY_LABELS,
  PRODUCTION_PLAN_STATUS_BADGE_VARIANTS,
  PRODUCTION_PLAN_STATUS_LABELS,
  type ProductionPlanPriority,
  type ProductionPlanResponseDTO,
  type ProductionPlanStatus,
} from "@/pages/production/planning/model";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  Modal,
  SearchFilterBar,
  StatCard,
  Table,
} from "@/shared/ui";

const DEFAULT_STATUS_FILTER = "";
const EXCLUDED_STATUSES: ProductionPlanStatus[] = ["IN_PROGRESS", "COMPLETED"];

export const ProductionPlanning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedPlan, setSelectedPlan] =
    useState<ProductionPlanResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);

  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

  const selectedStatuses = useMemo<ProductionPlanStatus[]>(() => {
    if (statusFilter.trim().length === 0) {
      return [];
    }
    return statusFilter
      .split(",")
      .map((status) => status.trim())
      .filter(
        (status): status is ProductionPlanStatus =>
          status in PRODUCTION_PLAN_STATUS_LABELS,
      );
  }, [statusFilter]);

  const selectedPriorities = useMemo<ProductionPlanPriority[]>(() => {
    const trimmed = priorityFilter.trim();
    if (trimmed.length === 0) {
      return [];
    }
    return trimmed in PRODUCTION_PLAN_PRIORITY_LABELS
      ? [trimmed as ProductionPlanPriority]
      : [];
  }, [priorityFilter]);

  const { data, isLoading, isError, refetch } = useProductionPlansQuery({
    factoryId: DEFAULT_FACTORY_ID,
    query: searchTerm === "" ? undefined : searchTerm,
    priorities: selectedPriorities.length > 0 ? selectedPriorities : undefined,
    includeRecentDays: DEFAULT_INCLUDE_RECENT_DAYS,
    page,
    size,
  });

  const rawPlans = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const plans = useMemo(() => {
    const visiblePlans = rawPlans.filter(
      (plan) =>
        !plan.status ||
        !EXCLUDED_STATUSES.includes(plan.status as ProductionPlanStatus),
    );

    if (selectedStatuses.length === 0) {
      return visiblePlans;
    }

    return visiblePlans.filter((plan) =>
      plan.status
        ? selectedStatuses.includes(plan.status as ProductionPlanStatus)
        : false,
    );
  }, [rawPlans, selectedStatuses]);

  type AugmentedPlan = ProductionPlanResponseDTO & { __rowKey: string };

  const normalizedPlans = useMemo<AugmentedPlan[]>(() => {
    return plans.map((plan, index) => ({
      ...plan,
      __rowKey: String(
        plan.orderId ??
          plan.orderCode ??
          plan.externalPartOrderId ??
          `plan-${index}`,
      ),
    }));
  }, [plans]);

  const selectedPlans = useMemo(
    () =>
      normalizedPlans.filter((plan) => selectedPlanIds.includes(plan.__rowKey)),
    [normalizedPlans, selectedPlanIds],
  );

  const allVisibleSelected =
    normalizedPlans.length > 0 &&
    normalizedPlans.every((plan) => selectedPlanIds.includes(plan.__rowKey));

  const stats = useMemo(() => {
    const statusCounter = plans.reduce<Record<string, number>>((acc, plan) => {
      if (plan.status) {
        acc[plan.status] = (acc[plan.status] ?? 0) + 1;
      }
      return acc;
    }, {});

    return {
      total: plans.length,
      planConfirmed: statusCounter.PLAN_CONFIRMED ?? 0,
      underReview: statusCounter.UNDER_REVIEW ?? 0,
      purchaseRequest: statusCounter.PURCHASE_REQUEST ?? 0,
      delayed: statusCounter.DELAYED ?? 0,
    };
  }, [plans]);

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(PRODUCTION_PLAN_STATUS_LABELS)
      .filter(
        ([value]) => !EXCLUDED_STATUSES.includes(value as ProductionPlanStatus),
      )
      .map(([value, label]) => ({
        value,
        label,
      })),
  ];

  const priorityOptions = [
    { value: "", label: "전체 우선순위" },
    ...Object.entries(PRODUCTION_PLAN_PRIORITY_LABELS).map(
      ([value, label]) => ({
        value,
        label,
      }),
    ),
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
    items?: ProductionPlanResponseDTO["items"],
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
    setStatusFilter(DEFAULT_STATUS_FILTER);
    setPriorityFilter("");
    onPageChange(0);
    void refetch();
  };

  const togglePlanSelection = (key: string, checked: boolean) => {
    setSelectedPlanIds((prev) => {
      if (checked) {
        return prev.includes(key) ? prev : [...prev, key];
      }
      return prev.filter((id) => id !== key);
    });
  };

  const handleToggleAll = () => {
    if (allVisibleSelected) {
      setSelectedPlanIds((prev) =>
        prev.filter(
          (id) => !normalizedPlans.some((plan) => plan.__rowKey === id),
        ),
      );
    } else {
      setSelectedPlanIds((prev) => {
        const next = new Set(prev);
        normalizedPlans.forEach((plan) => next.add(plan.__rowKey));
        return Array.from(next);
      });
    }
  };

  const handleRunMRP = () => {
    console.log("MRP 실행 - 선택된 계획:", selectedPlans);
  };

  const handleViewDetails = (plan: ProductionPlanResponseDTO) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const keys = createKeyRecord<AugmentedPlan>(normalizedPlans);

  const columns = [
    {
      key: "__select",
      title: "선택",
      width: "70px",
      render: (_value: unknown, row: AugmentedPlan) => (
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={selectedPlanIds.includes(row.__rowKey)}
          onChange={(event) =>
            togglePlanSelection(row.__rowKey, event.target.checked)
          }
        />
      ),
    },
    {
      key: keys.orderCode ?? "orderCode",
      title: "계획 코드",
      width: "160px",
      render: (value: string | undefined, row: AugmentedPlan) =>
        value ?? row.orderId ?? "-",
    },
    {
      key: keys.items ?? "items",
      title: "대표 품목",
      render: (
        _value: ProductionPlanResponseDTO["items"],
        row: ProductionPlanResponseDTO,
      ) => formatItemsSummary(row.items),
    },
    {
      key: keys.priority ?? "priority",
      title: "우선순위",
      width: "110px",
      render: (value: string | undefined) =>
        value ? (
          <Badge
            variant={
              PRODUCTION_PLAN_PRIORITY_BADGE_VARIANTS[value] ?? "default"
            }
          >
            {PRODUCTION_PLAN_PRIORITY_LABELS[value] ?? value}
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
          <Badge
            variant={PRODUCTION_PLAN_STATUS_BADGE_VARIANTS[value] ?? "default"}
          >
            {PRODUCTION_PLAN_STATUS_LABELS[value] ?? value}
          </Badge>
        ) : (
          "-"
        ),
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_value: unknown, row: AugmentedPlan) => (
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-file-list-line"
          label="전체 계획"
          value={stats.total}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-check-line"
          label="확정 계획"
          value={stats.planConfirmed}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon="ri-time-line"
          label="검토 중"
          value={stats.underReview}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-shopping-cart-line"
          label="구매 요청"
          value={stats.purchaseRequest}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="계획 코드, 품목명 등 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: (value: string) => {
              setStatusFilter(value);
              onPageChange(0);
            },
          },
          {
            key: "priority",
            value: priorityFilter,
            options: priorityOptions,
            onChange: (value: string) => {
              setPriorityFilter(value);
              onPageChange(0);
            },
          },
        ]}
        actions={
          <>
            <Button
              variant="default"
              size="sm"
              onClick={handleRunMRP}
              disabled={selectedPlans.length === 0}
            >
              <i className="ri-play-line mr-2"></i>
              MRP 실행
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleAll}
              disabled={normalizedPlans.length === 0}
            >
              {allVisibleSelected ? "선택 해제" : "전체 선택"}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
          </>
        }
      />

      <PaginationTableSection
        title="생산 계획 목록"
        totalElements={totalElements}
        page={page}
        totalPages={totalPages}
        size={size}
        onSizeChange={onSizeChange}
        onPageChange={onPageChange}
        showRefresh
        onRefresh={() => {
          void refetch();
        }}
      >
        <Table
          columns={columns}
          data={normalizedPlans}
          loading={isLoading && data === undefined}
          emptyText="조건에 맞는 생산 계획이 없습니다."
          errorText={
            isError ? "데이터 로딩 중 오류가 발생했습니다." : undefined
          }
        />
      </PaginationTableSection>

      <Modal
        open={isModalOpen && selectedPlan !== null}
        onClose={handleCloseModal}
        title="생산 계획 상세"
        widthClassName="max-w-2xl"
      >
        {selectedPlan && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    계획 코드
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedPlan.orderCode ?? selectedPlan.orderId ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    상태
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedPlan.status
                      ? (PRODUCTION_PLAN_STATUS_LABELS[selectedPlan.status] ??
                        selectedPlan.status)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    우선순위
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedPlan.priority
                      ? (PRODUCTION_PLAN_PRIORITY_LABELS[
                          selectedPlan.priority
                        ] ?? selectedPlan.priority)
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    요청일 / 계획일
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(selectedPlan.requiredDate)} /{" "}
                    {formatDate(selectedPlan.scheduledDate)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                부품 목록
              </h4>
              {selectedPlan.items && selectedPlan.items.length > 0 ? (
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
                      {selectedPlan.items.map((item, index) => (
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
