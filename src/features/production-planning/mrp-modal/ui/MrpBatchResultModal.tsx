import { useMemo } from "react";

import {
  PRODUCTION_PLAN_PRIORITY_LABELS,
  PRODUCTION_PLAN_STATUS_BADGE_VARIANTS,
  PRODUCTION_PLAN_STATUS_LABELS,
  type ProductionPlanResponseDTO,
} from "@/pages/production/planning/model";
import { Badge, Button, Modal } from "@/shared/ui";

type MrpPlan = ProductionPlanResponseDTO & { __rowKey: string };

type MrpPlanDetail = {
  plan: MrpPlan;
  orderId: number;
  included: boolean;
  totalQuantity: number;
};

type StatusSummary = Array<{
  status: string;
  label: string;
  count: number;
}>;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ko-KR");
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

const extractOrderId = (plan: MrpPlan) => {
  if (typeof plan.orderId === "number") {
    return plan.orderId;
  }
  if (typeof plan.externalPartOrderId === "number") {
    return plan.externalPartOrderId;
  }
  const parsed = Number(plan.__rowKey);
  return Number.isNaN(parsed) ? -1 : parsed;
};

const calculatePlanDetails = (
  plans: MrpPlan[],
  executedOrderIds: number[],
): MrpPlanDetail[] => {
  const executedSet = new Set(executedOrderIds);

  return plans.map((plan) => {
    const orderId = extractOrderId(plan);
    const totalQuantity =
      plan.items?.reduce(
        (sum, item) =>
          sum + (typeof item?.quantity === "number" ? item.quantity : 0),
        0,
      ) ?? 0;

    return {
      plan,
      orderId,
      included: executedSet.has(orderId),
      totalQuantity,
    };
  });
};

const calculateSummary = (plans: MrpPlan[], details: MrpPlanDetail[]) => {
  if (plans.length === 0) {
    return {
      total: 0,
      executed: 0,
      pending: 0,
      byStatus: {} as Record<string, number>,
      statusSummary: [] as StatusSummary,
    };
  }

  const executedCount = details.reduce(
    (count, detail) => (detail.included ? count + 1 : count),
    0,
  );

  const statusCounter = plans.reduce<Record<string, number>>((acc, plan) => {
    const statusKey = plan.status ?? "UNKNOWN";
    acc[statusKey] = (acc[statusKey] ?? 0) + 1;
    return acc;
  }, {});

  const statusSummary = Object.entries(statusCounter).map(
    ([status, count]) => ({
      status,
      label:
        PRODUCTION_PLAN_STATUS_LABELS[status] ??
        (status === "UNKNOWN" ? "상태 미정" : status),
      count,
    }),
  );

  return {
    total: plans.length,
    executed: executedCount,
    pending: Math.max(0, plans.length - executedCount),
    byStatus: statusCounter,
    statusSummary,
  };
};

export type MrpBatchResultModalProps = {
  open: boolean;
  isLoading: boolean;
  error: string | null;
  plans: MrpPlan[];
  executedOrderIds: number[];
  onClose: () => void;
  onApply: () => void;
  isApplying: boolean;
};

export const MrpBatchResultModal = ({
  open,
  isLoading,
  error,
  plans,
  executedOrderIds,
  onClose,
  onApply,
  isApplying,
}: MrpBatchResultModalProps) => {
  const planDetails = useMemo(
    () => calculatePlanDetails(plans, executedOrderIds),
    [plans, executedOrderIds],
  );

  const summary = useMemo(
    () => calculateSummary(plans, planDetails),
    [plans, planDetails],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="MRP 실행 결과"
      widthClassName="max-w-3xl"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-3 py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-main-500 border-t-transparent" />
          <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
            MRP 분석 중입니다...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            잠시만 기다려 주세요.
          </p>
        </div>
      ) : (
        <>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    분석 대상
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.total}
                  </p>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-500/30 dark:bg-green-500/10">
                  <p className="text-sm font-medium text-green-700 dark:text-green-200">
                    실행 완료
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-200">
                    {summary.executed}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-500/30 dark:bg-amber-500/10">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-200">
                    추가 검토 필요
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-200">
                    {summary.pending}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    상태 분포
                  </p>
                  <div className="mt-2 space-y-1 text-left text-xs text-gray-600 dark:text-gray-300">
                    {summary.statusSummary.length > 0 ? (
                      summary.statusSummary.map(({ status, label, count }) => (
                        <div
                          key={`mrp-status-${status}`}
                          className="flex items-center justify-between"
                        >
                          <span>{label}</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">
                            {count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span>데이터 없음</span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300">
                실행 결과를 확인하고 필요 시 추가 조치를 진행해 주세요.
              </p>

              <div className="max-h-[40vh] space-y-3 overflow-auto">
                {planDetails.length > 0 ? (
                  planDetails.map(
                    ({ plan, included, orderId, totalQuantity }) => (
                      <div
                        key={`mrp-plan-${plan.__rowKey}`}
                        className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              {plan.orderCode ?? plan.orderId ?? plan.__rowKey}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-300">
                              주문 ID: {orderId < 0 ? "-" : orderId}
                            </p>
                          </div>
                          <div>
                            <Badge
                              variant={
                                included
                                  ? "success"
                                  : plan.status &&
                                      PRODUCTION_PLAN_STATUS_BADGE_VARIANTS[
                                        plan.status
                                      ]
                                    ? PRODUCTION_PLAN_STATUS_BADGE_VARIANTS[
                                        plan.status
                                      ]
                                    : "warning"
                              }
                            >
                              {included ? "실행 완료" : "검토 필요"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-gray-600 md:grid-cols-3 dark:text-gray-300">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              상태
                            </span>
                            <p className="mt-1">
                              {plan.status
                                ? (PRODUCTION_PLAN_STATUS_LABELS[plan.status] ??
                                  plan.status)
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              우선순위
                            </span>
                            <p className="mt-1">
                              {plan.priority
                                ? (PRODUCTION_PLAN_PRIORITY_LABELS[
                                    plan.priority
                                  ] ?? plan.priority)
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              요청/계획일
                            </span>
                            <p className="mt-1">
                              {formatDate(plan.requiredDate)} /{" "}
                              {formatDate(plan.scheduledDate)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-gray-600 md:grid-cols-3 dark:text-gray-300">
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              총 필요 수량
                            </span>
                            <p className="mt-1">{totalQuantity}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              대표 품목
                            </span>
                            <p className="mt-1">
                              {formatItemsSummary(plan.items)}
                            </p>
                          </div>
                        </div>
                        {plan.items && plan.items.length > 0 && (
                          <div className="mt-3 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">
                                    품목명
                                  </th>
                                  <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300">
                                    품목코드
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-300">
                                    수량
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {plan.items.map((item, index) => (
                                  <tr
                                    key={`mrp-plan-item-${plan.__rowKey}-${item?.partId ?? index}`}
                                  >
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">
                                      {item?.partName ?? "-"}
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 dark:text-gray-300">
                                      {item?.partCode ?? "-"}
                                    </td>
                                    <td className="px-3 py-2 text-right text-gray-800 dark:text-gray-100">
                                      {item?.quantity ?? "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ),
                  )
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-300">
                    표시할 계획 정보가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading || isApplying}
            >
              닫기
            </Button>
            <Button
              variant="default"
              onClick={onApply}
              disabled={
                error !== null || executedOrderIds.length === 0 || isApplying
              }
              loading={isApplying}
            >
              결과 적용
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};
