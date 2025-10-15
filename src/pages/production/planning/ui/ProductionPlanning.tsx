import { useEffect, useMemo, useState } from "react";import { useLoaderData } from "react-router-dom";import { useBranchId, useBranchSelectionStore } from "@/features/branch-select";import { MrpBatchResultModal } from "@/features/production-planning";import { PaginationTableSection, usePaginationTable } from "@/features/table-pagination";import { extractPlansFromMrpResponse, useBatchMrpApplyMutation, useBatchMrpExecutionMutation, useProductionPlansQuery } from "../api";import { DEFAULT_INCLUDE_RECENT_DAYS, PRODUCTION_PLAN_MATERIAL_AVAILABILITY_BADGE_VARIANTS, PRODUCTION_PLAN_MATERIAL_AVAILABILITY_LABELS, PRODUCTION_PLAN_PRIORITY_BADGE_VARIANTS, PRODUCTION_PLAN_PRIORITY_LABELS, PRODUCTION_PLAN_STATUS_BADGE_VARIANTS, PRODUCTION_PLAN_STATUS_LABELS, type ProductionPlanPriority, type ProductionPlanResponseDTO, type ProductionPlanStatus } from "../model";import { createKeyRecord } from "@/shared/lib";import { Badge, Button, SearchFilterBar, Table } from "@/shared/ui";const DEFAULT_STATUS_FILTER = "UNDER_REVIEW";
const EXCLUDED_STATUSES: ProductionPlanStatus[] = ["IN_PROGRESS", "COMPLETED"];

export const ProductionPlanning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [isMrpModalOpen, setIsMrpModalOpen] = useState(false);
  const [mrpResultPlans, setMrpResultPlans] = useState<
    ProductionPlanResponseDTO[]
  >([]);
  const [mrpError, setMrpError] = useState<string | null>(null);

  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

  const executeBatchMrpMutation = useBatchMrpExecutionMutation();
  const applyBatchMrpMutation = useBatchMrpApplyMutation();

  const { defaultFactoryId } = useLoaderData() as {
    defaultFactoryId?: number;
  };
  const selectedFactoryId = useBranchId("factory");
  const setBranchSelection = useBranchSelectionStore(
    (state) => state.setSelection,
  );
  const factoryId = selectedFactoryId ? Number(selectedFactoryId) : undefined;

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

  const queryParams = useMemo(() => {
    if (typeof factoryId !== "number" || Number.isNaN(factoryId)) {
      return undefined;
    }
    return {
      factoryId,
      query: searchTerm === "" ? undefined : searchTerm,
      priorities:
        selectedPriorities.length > 0 ? selectedPriorities : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      includeRecentDays: DEFAULT_INCLUDE_RECENT_DAYS,
      page,
      size,
    };
  }, [factoryId, searchTerm, selectedPriorities, selectedStatuses, page, size]);

  const { data, isLoading, isError, refetch } =
    useProductionPlansQuery(queryParams);

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

  const plans = (data?.data?.content ?? []) as ProductionPlanResponseDTO[];
  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const normalizedPlans = plans;

  const isMrpRunning = executeBatchMrpMutation.isPending;

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

  const renderMaterialAvailability = (value?: string | null) => {
    if (!value) {
      return "-";
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return "-";
    }

    const normalized = trimmed.toUpperCase();

    const label =
      PRODUCTION_PLAN_MATERIAL_AVAILABILITY_LABELS[normalized] ??
      PRODUCTION_PLAN_MATERIAL_AVAILABILITY_LABELS[trimmed] ??
      trimmed;

    const variant =
      PRODUCTION_PLAN_MATERIAL_AVAILABILITY_BADGE_VARIANTS[normalized] ??
      PRODUCTION_PLAN_MATERIAL_AVAILABILITY_BADGE_VARIANTS[trimmed] ??
      "default";

    return <Badge variant={variant}>{label}</Badge>;
  };

  const renderStatusBadge = (value?: string | null) => {
    if (!value || value.length === 0) {
      return "-";
    }

    const normalized = value.toUpperCase();

    const label =
      PRODUCTION_PLAN_STATUS_LABELS[value] ??
      PRODUCTION_PLAN_STATUS_LABELS[normalized] ??
      value;

    const variant =
      PRODUCTION_PLAN_STATUS_BADGE_VARIANTS[value] ??
      PRODUCTION_PLAN_STATUS_BADGE_VARIANTS[normalized] ??
      "default";

    return <Badge variant={variant}>{label}</Badge>;
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter(DEFAULT_STATUS_FILTER);
    setPriorityFilter("");
    onPageChange(0);
    void refetch();
  };

  const handleRunMRP = () => {
    if (selectedPlanIds.length === 0 || executeBatchMrpMutation.isPending) {
      return;
    }
    if (typeof factoryId !== "number" || Number.isNaN(factoryId)) {
      setMrpResultPlans([]);
      setMrpError("공장을 선택한 후 MRP를 실행할 수 있습니다.");
      setIsMrpModalOpen(true);
      return;
    }

    const orderIds = selectedPlanIds
      .map((id) => Number(id))
      .filter((value): value is number => Number.isFinite(value));

    setMrpResultPlans([]);
    setMrpError(null);

    if (orderIds.length === 0) {
      setIsMrpModalOpen(true);
      setMrpError("선택된 계획에서 주문 ID를 확인할 수 없습니다.");
      return;
    }

    setIsMrpModalOpen(true);

    executeBatchMrpMutation.mutate(
      {
        params: {
          path: {
            factoryId,
          },
        },
        body: orderIds,
      },
      {
        onSuccess: (response) => {
          const plans = extractPlansFromMrpResponse(response);
          if (plans.length === 0) {
            setMrpResultPlans([]);
            setMrpError("MRP 실행 결과가 비어 있습니다.");
            return;
          }
          setMrpError(null);
          setMrpResultPlans(plans);
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "MRP 실행 중 오류가 발생했습니다.";
          setMrpError(message);
        },
      },
    );
  };

  const handleApplyMrpResult = () => {
    if (
      mrpResultPlans.length === 0 ||
      applyBatchMrpMutation.isPending ||
      executeBatchMrpMutation.isPending
    ) {
      return;
    }

    const orderIds = mrpResultPlans
      .map((plan) => plan.orderId)
      .filter((value): value is number => Number.isFinite(value));
    if (orderIds.length === 0) {
      setMrpError("MRP 결과에서 주문 ID를 확인할 수 없습니다.");
      return;
    }

    if (typeof factoryId !== "number" || Number.isNaN(factoryId)) {
      setMrpError("공장을 선택한 후 MRP 결과를 적용할 수 있습니다.");
      return;
    }

    applyBatchMrpMutation.mutate(
      {
        params: {
          path: {
            factoryId,
          },
        },
        body: orderIds,
      },
      {
        onSuccess: () => {
          setMrpError(null);
          setIsMrpModalOpen(false);
          setMrpResultPlans([]);
          setSelectedPlanIds([]);
          void refetch();
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "MRP 결과 적용 중 오류가 발생했습니다.";
          setMrpError(message);
        },
      },
    );
  };

  const handleCloseMrpModal = () => {
    if (executeBatchMrpMutation.isPending || applyBatchMrpMutation.isPending) {
      return;
    }
    setIsMrpModalOpen(false);
    setMrpResultPlans([]);
    setMrpError(null);
  };

  const keys = createKeyRecord<ProductionPlanResponseDTO>(normalizedPlans);

  const columns = [
    {
      key: keys.orderCode ?? "orderCode",
      title: "계획 코드",
      width: "160px",
      render: (value: string | undefined, row: ProductionPlanResponseDTO) =>
        value ?? row.orderId ?? "-",
    },
    {
      key: keys.items ?? "items",
      title: "품목",
      render: (
        _value: ProductionPlanResponseDTO["items"],
        row: ProductionPlanResponseDTO,
      ) => {
        const items = row.items ?? [];
        if (items.length === 0) {
          return "-";
        }
        const [first, ...rest] = items;
        const firstLabel = first?.partName ?? first?.partCode ?? "-";
        if (rest.length === 0) {
          return firstLabel ?? "-";
        }
        return `${firstLabel ?? "-"} 외 ${rest.length}`;
      },
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
      key: keys.materialAvailability ?? "materialAvailability",
      title: "자재 가용성",
      width: "140px",
      render: (value: string | undefined) =>
        renderMaterialAvailability(value ?? null),
    },
    {
      key: keys.status ?? "status",
      title: "상태",
      width: "120px",
      render: (value: string | undefined) => renderStatusBadge(value ?? null),
    },
  ];

  if (typeof factoryId !== "number" || Number.isNaN(factoryId)) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          상단에서 공장을 선택하면 생산 계획 데이터를 확인할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <>
      {isMrpRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex w-full max-w-sm flex-col items-center rounded-lg bg-white p-8 text-center shadow-xl dark:bg-gray-900">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-main-500 border-t-transparent" />
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              MRP 분석 중...
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              선택한 계획에 대해 자재와 일정 정보를 검토하고 있습니다.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-8">
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
                disabled={selectedPlanIds.length === 0 || isMrpRunning}
              >
                <i className="ri-play-line mr-2"></i>
                MRP 실행
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetFilters}
              >
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
            selectable
            rowKey="orderId"
            selectedRowKeys={selectedPlanIds}
            onSelectionChange={(keys) => setSelectedPlanIds(keys.map(String))}
            columns={columns}
            data={normalizedPlans}
            loading={isLoading && data === undefined}
            emptyText="조건에 맞는 생산 계획이 없습니다."
            errorText={
              isError ? "데이터 로딩 중 오류가 발생했습니다." : undefined
            }
          />
        </PaginationTableSection>

        <MrpBatchResultModal
          open={isMrpModalOpen}
          isLoading={isMrpRunning}
          error={mrpError}
          plans={mrpResultPlans}
          onClose={handleCloseMrpModal}
          onApply={handleApplyMrpResult}
          isApplying={applyBatchMrpMutation.isPending}
        />
      </div>
    </>
  );
};
