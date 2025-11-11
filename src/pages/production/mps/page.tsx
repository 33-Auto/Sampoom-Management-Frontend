import { useCallback, useEffect, useMemo, useState } from "react";

import {
  fetchMpsByWarehouse,
  useConfirmMpsMutation,
  useExecuteMpsMutation,
  useMpsPartsQuery,
  usePartForecastMonthsQuery,
  type MpsDetail,
  type MpsPartInfoResponse,
  type PartForecastMonthsResponse,
  type MpsPlanResult,
  type PartOrderResult,
} from "@/entities/mps";
import { useWarehouses } from "@/entities/wms";
import { useBranchId } from "@/features/branch-select/model/branch-selection.store";
// import { BranchSelectBar } from "@/features/branch-select/ui/BranchSelectBar";
import { MpsExecutionResultModal } from "@/features/production-mps";
import { formatNumber } from "@/shared/lib/format/number";
import { Badge, Button, InfoBox, SearchFilterBar } from "@/shared/ui";
// import { ModuleHeader, NavigationTabs } from "@/widgets/Header";

const STATUS_LABEL: Record<string, string> = {
  PLANNED: "계획",
  PROCESSING: "진행중",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

const getStatusVariant = (status?: string) => {
  switch (status) {
    case "COMPLETED":
      return "success" as const;
    case "PROCESSING":
      return "warning" as const;
    case "CANCELLED":
      return "error" as const;
    case "PLANNED":
      return "info" as const;
    default:
      return undefined;
  }
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatForecastMonth = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
  });
};

const formatQuantity = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return `${formatNumber(value)} EA`;
};

type MpsTableRow = {
  key: string;
  warehouseId: number;
  warehouseName: string;
  mpsId?: number;
  targetDate?: string;
  forecastQuantity?: number;
  totalProduction?: number;
  expectedInventory?: number;
  safetyStock?: number;
  status?: string;
  standardQuantity?: number;
  leadTime?: number;
};

// const PRODUCTION_HEADER = {
//   moduleTitle: "생산 관리",
//   moduleDescription: "생산 지시 및 계획을 관리합니다",
//   moduleIcon: "ri-settings-4-line",
//   moduleColor: "bg-orange-600",
// } as const;

// const PRODUCTION_NAV_ITEMS = [
//   {
//     path: "/production/orders",
//     label: "생산 지시(MES)",
//     icon: "ri-hammer-line",
//   },
//   {
//     path: "/production/planning",
//     label: "생산 계획(MRP)",
//     icon: "ri-calendar-line",
//   },
//   {
//     path: "/production/mps",
//     label: "생산 스케줄(MPS)",
//     icon: "ri-calendar-schedule-line",
//   },
//   {
//     path: "/production/performance",
//     label: "생산 실적",
//     icon: "ri-bar-chart-line",
//   },
// ] as const;

export default function MasterProductionSchedule() {
  const selectedFactoryBranchId = useBranchId("factory");
  const factoryId = useMemo(() => {
    if (!selectedFactoryBranchId) {
      return undefined;
    }
    const parsed = Number(selectedFactoryBranchId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [selectedFactoryBranchId]);
  const hasFactoryId =
    typeof factoryId === "number" && Number.isFinite(factoryId);

  const warehouses = useWarehouses();

  const {
    data: partsData,
    isLoading: isPartsLoading,
    isError: isPartsError,
  } = useMpsPartsQuery(factoryId);
  const partsResponse = partsData as MpsPartInfoResponse;
  const partOptions = useMemo(() => {
    const items = partsResponse?.data ?? [];
    const options = items
      .filter((item) => typeof item?.partId === "number")
      .map((item) => ({
        value: String(item.partId),
        label: item.partName
          ? `${item.partName}${item.partCode ? ` (${item.partCode})` : ""}`
          : item.partCode
            ? item.partCode
            : String(item.partId),
      }));

    return [{ value: "", label: "부품을 선택하세요" }, ...options];
  }, [partsResponse]);

  const [selectedPartId, setSelectedPartId] = useState("");
  const partIdNumber = useMemo(() => {
    if (!selectedPartId) return undefined;
    const parsed = Number(selectedPartId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [selectedPartId]);

  const {
    data: forecastMonthsData,
    isLoading: isForecastLoading,
    isError: isForecastError,
  } = usePartForecastMonthsQuery(factoryId, partIdNumber);
  const forecastResponse = forecastMonthsData as PartForecastMonthsResponse;
  const forecastOptions = useMemo(() => {
    const months = forecastResponse?.data ?? [];
    const options = months.map((month) => ({
      value: month,
      label: formatForecastMonth(month),
    }));

    return [{ value: "", label: "예측 월을 선택하세요" }, ...options];
  }, [forecastResponse]);

  const [selectedForecastMonth, setSelectedForecastMonth] = useState("");
  const [mpsRows, setMpsRows] = useState<MpsTableRow[]>([]);
  const [fetchErrors, setFetchErrors] = useState<string[]>([]);
  const [isFetchingMps, setIsFetchingMps] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingAction, setPendingAction] = useState<{
    type: "execute" | "confirm";
    mpsId: number;
  } | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [resultMode, setResultMode] = useState<"execute" | "confirm">(
    "execute",
  );
  const [resultPlans, setResultPlans] = useState<MpsPlanResult[]>([]);
  const [resultOrders, setResultOrders] = useState<PartOrderResult[]>([]);
  const [resultError, setResultError] = useState<string | null>(null);

  const executeMutation = useExecuteMpsMutation();
  const confirmMutation = useConfirmMpsMutation();

  const resetResultState = useCallback(() => {
    setResultPlans([]);
    setResultOrders([]);
    setResultError(null);
    setIsResultModalOpen(false);
  }, []);

  const handleCloseResultModal = useCallback(() => {
    if (executeMutation.isPending || confirmMutation.isPending) {
      return;
    }
    setIsResultModalOpen(false);
  }, [confirmMutation.isPending, executeMutation.isPending]);

  useEffect(() => {
    setSelectedForecastMonth("");
    resetResultState();
  }, [resetResultState, selectedPartId]);

  useEffect(() => {
    resetResultState();
  }, [resetResultState, selectedForecastMonth]);

  useEffect(() => {
    let cancelled = false;

    if (
      !hasFactoryId ||
      typeof factoryId !== "number" ||
      !partIdNumber ||
      !selectedForecastMonth ||
      warehouses.length === 0
    ) {
      setMpsRows([]);
      setFetchErrors([]);
      setIsFetchingMps(false);
      return () => {
        cancelled = true;
      };
    }

    setIsFetchingMps(true);
    setPendingAction(null);

    void (async () => {
      const results = await Promise.allSettled(
        warehouses.map(async (warehouse) =>
          fetchMpsByWarehouse({
            factoryId,
            partId: partIdNumber,
            forecastMonth: selectedForecastMonth,
            warehouseId: warehouse.id,
          }),
        ),
      );

      if (cancelled) {
        return;
      }

      const nextRows: MpsTableRow[] = [];
      const nextErrors = new Set<string>();

      results.forEach((result, index) => {
        const warehouse = warehouses[index];
        const warehouseLabel = warehouse?.name
          ? `${warehouse.name} (ID: ${warehouse.id})`
          : `창고 ${warehouse?.id ?? index + 1}`;

        if (result.status === "fulfilled") {
          const response = result.value;
          const detail = (response?.data ?? null) as MpsDetail | null;
          if (detail) {
            nextRows.push({
              key: `${warehouse.id}-${detail.mpsId ?? "unknown"}`,
              warehouseId: warehouse.id,
              warehouseName: warehouse?.name ?? `창고 ${warehouse.id}`,
              mpsId: detail.mpsId ?? undefined,
              targetDate: detail.targetDate ?? undefined,
              forecastQuantity: detail.forecastQuantity ?? undefined,
              totalProduction: detail.totalProduction ?? undefined,
              expectedInventory: detail.expectedInventory ?? undefined,
              safetyStock: detail.safetyStock ?? undefined,
              status: detail.status ?? undefined,
              standardQuantity: detail.standardQuantity ?? undefined,
              leadTime: detail.leadTime ?? undefined,
            });
          } else {
            nextErrors.add(`${warehouseLabel}: 응답 데이터가 비어 있습니다.`);
          }
        } else {
          const reason = result.reason;
          const message =
            reason instanceof Error
              ? reason.message
              : typeof reason === "string"
                ? reason
                : "알 수 없는 오류가 발생했습니다.";
          nextErrors.add(`${warehouseLabel}: ${message}`);
        }
      });

      nextRows.sort((a, b) => a.warehouseId - b.warehouseId);

      setMpsRows(nextRows);
      // setFetchErrors(Array.from(nextErrors));
      setIsFetchingMps(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    factoryId,
    hasFactoryId,
    partIdNumber,
    selectedForecastMonth,
    warehouses,
    reloadKey,
  ]);

  const currentRow = useMemo(() => {
    if (mpsRows.length === 0) {
      return null;
    }
    return (
      mpsRows.find((row) => typeof row.mpsId === "number") ?? mpsRows[0] ?? null
    );
  }, [mpsRows]);

  const handleExecute = useCallback(() => {
    if (!hasFactoryId || typeof factoryId !== "number") {
      setResultMode("execute");
      setResultPlans([]);
      setResultOrders([]);
      setResultError("공장을 먼저 선택한 후 다시 시도하세요.");
      setIsResultModalOpen(false);
      return;
    }
    if (!currentRow || typeof currentRow.mpsId !== "number") {
      setResultMode("execute");
      setResultPlans([]);
      setResultOrders([]);
      setResultError("선택된 창고의 MPS 데이터를 먼저 조회하세요.");
      setIsResultModalOpen(false);
      return;
    }

    setResultMode("execute");
    setResultPlans([]);
    setResultOrders([]);
    setResultError(null);
    setIsResultModalOpen(false);

    setPendingAction({ type: "execute", mpsId: currentRow.mpsId });
    executeMutation.mutate(
      {
        params: {
          path: {
            factoryId,
            mpsId: currentRow.mpsId,
          },
        },
      },
      {
        onSuccess: (response) => {
          const plans = (response?.data ?? []) as MpsPlanResult[];
          setResultMode("execute");
          setResultPlans(plans);
          setResultOrders([]);
          setResultError(
            plans.length === 0 ? "생성된 생산 주기가 없습니다." : null,
          );
          setReloadKey((prev) => prev + 1);
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "MPS 실행 중 오류가 발생했습니다.";
          setFetchErrors((prev) => [...prev, message]);
          setResultMode("execute");
          setResultPlans([]);
          setResultOrders([]);
          setResultError(message);
        },
        onSettled: () => {
          setPendingAction(null);
        },
      },
    );
  }, [currentRow, executeMutation, factoryId, hasFactoryId]);

  const handleConfirm = useCallback(() => {
    if (!hasFactoryId || typeof factoryId !== "number") {
      setResultMode("confirm");
      setResultPlans([]);
      setResultOrders([]);
      setResultError("공장을 먼저 선택한 후 다시 시도하세요.");
      setIsResultModalOpen(true);
      return;
    }
    if (!currentRow || typeof currentRow.mpsId !== "number") {
      setResultMode("confirm");
      setResultPlans([]);
      setResultOrders([]);
      setResultError("MPS 실행을 먼저 진행하세요.");
      setIsResultModalOpen(true);
      return;
    }
    if (resultPlans.length === 0) {
      setResultMode("confirm");
      setResultOrders([]);
      setResultError("MPS 실행 결과가 없습니다. 먼저 실행을 수행하세요.");
      setIsResultModalOpen(true);
      return;
    }

    setResultMode("confirm");
    setResultOrders([]);
    setResultError(null);
    setIsResultModalOpen(true);

    setPendingAction({ type: "confirm", mpsId: currentRow.mpsId });
    confirmMutation.mutate(
      {
        params: {
          path: {
            factoryId,
            mpsId: currentRow.mpsId,
          },
        },
      },
      {
        onSuccess: (response) => {
          const orders = (response?.data ?? []) as PartOrderResult[];
          setResultMode("confirm");
          setResultOrders(orders);
          setResultError(
            orders.length === 0 ? "확정된 주문이 없습니다." : null,
          );
          setReloadKey((prev) => prev + 1);
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "MPS 확정 중 오류가 발생했습니다.";
          setFetchErrors((prev) => [...prev, message]);
          setResultMode("confirm");
          setResultOrders([]);
          setResultError(message);
        },
        onSettled: () => {
          setPendingAction(null);
        },
      },
    );
  }, [
    confirmMutation,
    currentRow,
    factoryId,
    hasFactoryId,
    resultPlans.length,
  ]);

  const hasWarehouse = warehouses.length > 0;

  const isExecutePending =
    pendingAction?.type === "execute" && executeMutation.isPending;
  const isConfirmPending =
    pendingAction?.type === "confirm" && confirmMutation.isPending;

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      {/* <ModuleHeader {...PRODUCTION_HEADER} />
      <NavigationTabs
        navItems={PRODUCTION_NAV_ITEMS.map((item) => ({
          ...item,
          active: item.path === "/production/mps",
        }))}
        moduleColor={PRODUCTION_HEADER.moduleColor}
      />
      <BranchSelectBar moduleType="factory" /> */}

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <SearchFilterBar
          filters={[
            {
              key: "part",
              label: "부품",
              value: selectedPartId,
              options: partOptions,
              onChange: (value: string) => setSelectedPartId(value),
              disabled:
                !hasFactoryId || isPartsLoading || partOptions.length <= 1,
            },
            {
              key: "forecastMonth",
              label: "예측 월",
              value: selectedForecastMonth,
              options: forecastOptions,
              onChange: (value: string) => setSelectedForecastMonth(value),
              disabled:
                !hasFactoryId ||
                !partIdNumber ||
                isForecastLoading ||
                forecastOptions.length <= 1,
            },
          ]}
          actions={
            <>
              <Button
                variant="default"
                size="sm"
                loading={isExecutePending}
                disabled={
                  isExecutePending ||
                  isConfirmPending ||
                  !currentRow ||
                  typeof currentRow.mpsId !== "number"
                }
                onClick={handleExecute}
              >
                <i className="ri-play-line mr-2"></i>
                MPS 실행
              </Button>
              {/* <Button
                variant="secondary"
                size="sm"
                loading={isConfirmPending}
                disabled={
                  isConfirmPending ||
                  isExecutePending ||
                  !currentRow ||
                  typeof currentRow.mpsId !== "number" ||
                  resultPlans.length === 0
                }
                onClick={handleConfirm}
              >
                <i className="ri-check-line mr-2"></i>
                MPS 확정
              </Button> */}
            </>
          }
        />

        {isPartsError && (
          <InfoBox title="부품 데이터를 불러오지 못했습니다" type="error">
            잠시 후 다시 시도하거나 관리자에게 문의하세요.
          </InfoBox>
        )}

        {isForecastError && partIdNumber && (
          <InfoBox title="예측 월 정보를 불러오지 못했습니다" type="error">
            선택한 부품의 예측 월을 다시 시도해 주세요.
          </InfoBox>
        )}

        {hasFactoryId && !hasWarehouse && (
          <InfoBox title="등록된 창고가 없습니다" type="warning">
            WMS 지점에서 창고 목록을 등록한 후 다시 시도해 주세요. 현재 목록이
            비어 있어 MPS 데이터를 요청할 수 없습니다.
          </InfoBox>
        )}

        {fetchErrors.length > 0 && (
          <InfoBox title="창고별 조회 중 오류가 발생했습니다" type="warning">
            <ul className="mt-2 space-y-1">
              {fetchErrors.map((error, index) => (
                <li key={`${error}-${index}`} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </InfoBox>
        )}

        {isFetchingMps && (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-main-500 border-t-transparent" />
              <span>MPS 데이터를 불러오는 중입니다...</span>
            </div>
          </div>
        )}

        {!isFetchingMps && currentRow && (
          <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentRow.warehouseName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  창고 ID: {currentRow.warehouseId}
                </p>
              </div>
              {currentRow.status && (
                <Badge variant={getStatusVariant(currentRow.status)}>
                  {STATUS_LABEL[currentRow.status] ?? currentRow.status}
                </Badge>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  예측 수요
                </span>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formatQuantity(currentRow.forecastQuantity)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  생산 계획
                </span>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formatQuantity(currentRow.totalProduction)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  예상 재고
                </span>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formatQuantity(currentRow.expectedInventory)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  안전 재고
                </span>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {formatQuantity(currentRow.safetyStock)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-300">
              <div>
                <span className="block text-gray-500 dark:text-gray-400">
                  목표 날짜
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(currentRow.targetDate)}
                </span>
              </div>
              <div>
                <span className="block text-gray-500 dark:text-gray-400">
                  리드타임
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {typeof currentRow.leadTime === "number"
                    ? `${currentRow.leadTime}주`
                    : "-"}
                </span>
              </div>
            </div>
          </section>
        )}

        {!isFetchingMps && !currentRow && selectedForecastMonth && (
          <InfoBox title="MPS 데이터를 확인할 수 없습니다" type="warning">
            조건에 해당하는 창고별 MPS 데이터가 없습니다. 다른 조건으로 다시
            조회해 주세요.
          </InfoBox>
        )}

        {resultPlans.length > 0 && (
          <section className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm dark:border-blue-500/40 dark:bg-blue-900/20">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200">
                  MPS 실행 결과
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {currentRow?.warehouseName ?? "선택된 창고"}
                </p>
              </div>
              <div className="flex gap-2">
                {/* <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setResultMode("execute");
                    setIsResultModalOpen(true);
                  }}
                >
                  <i className="ri-eye-line mr-2"></i>
                  상세 보기
                </Button> */}
                <Button
                  variant="default"
                  size="sm"
                  loading={isConfirmPending}
                  disabled={
                    isConfirmPending ||
                    !currentRow ||
                    typeof currentRow.mpsId !== "number" ||
                    resultPlans.length === 0
                  }
                  onClick={handleConfirm}
                >
                  <i className="ri-check-line mr-2"></i>
                  MPS 확정
                </Button>
              </div>
            </div>

            {resultError && resultMode === "execute" && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                {resultError}
              </div>
            )}

            <div className="mt-6 space-y-3">
              {resultPlans.map((plan, index) => (
                <div
                  key={
                    plan.mpsPlanId ??
                    `${plan.mpsId ?? "plan"}-${plan.cycleNumber ?? index}`
                  }
                  className="rounded-md border border-blue-200 bg-white p-4 shadow-sm dark:border-blue-500/40 dark:bg-blue-900/40"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                      Cycle {plan.cycleNumber ?? index + 1}
                    </div>
                    {plan.status && (
                      <Badge variant={getStatusVariant(plan.status)}>
                        {STATUS_LABEL[plan.status] ?? plan.status}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-blue-900 sm:grid-cols-2 lg:grid-cols-4 dark:text-blue-100">
                    <div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        생산 수량
                      </span>
                      <p className="mt-1 font-semibold">
                        {formatNumber(plan.productionQuantity ?? 0)} EA
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        잔여 생산량
                      </span>
                      <p className="mt-1 font-semibold">
                        {formatNumber(plan.remainingTotalProduction ?? 0)} EA
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        납기일
                      </span>
                      <p className="mt-1 font-semibold">
                        {formatDate(plan.requiredDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-blue-700 dark:text-blue-300">
                        생성일
                      </span>
                      <p className="mt-1 font-semibold">
                        {formatDate(plan.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {resultMode === "confirm" && resultError && (
          <InfoBox title="MPS 확정 오류" type="error">
            {resultError}
          </InfoBox>
        )}
      </div>

      <MpsExecutionResultModal
        open={isResultModalOpen}
        mode={resultMode}
        isLoading={isExecutePending || isConfirmPending}
        error={resultError}
        plans={resultPlans}
        orders={resultOrders}
        onClose={handleCloseResultModal}
      />
    </div>
  );
}
