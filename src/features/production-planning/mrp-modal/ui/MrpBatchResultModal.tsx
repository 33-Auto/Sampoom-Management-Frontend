import {
  PRODUCTION_PLAN_MATERIAL_AVAILABILITY_BADGE_VARIANTS,
  PRODUCTION_PLAN_MATERIAL_AVAILABILITY_LABELS,
  PRODUCTION_PLAN_PRIORITY_LABELS,
  PRODUCTION_PLAN_STATUS_BADGE_VARIANTS,
  PRODUCTION_PLAN_STATUS_LABELS,
  type ProductionPlanResponseDTO,
} from "@/pages/production/planning/model";
import { Badge, Button, Modal } from "@/shared/ui";

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ko-KR");
};

const calculateTotalQuantity = (
  items?: ProductionPlanResponseDTO["items"],
): number => {
  if (!items || items.length === 0) {
    return 0;
  }
  return items.reduce(
    (sum, item) =>
      sum + (typeof item?.quantity === "number" ? item.quantity : 0),
    0,
  );
};

const getStatusLabel = (status?: string) => {
  if (!status) return "상태 미정";
  return PRODUCTION_PLAN_STATUS_LABELS[status] ?? status;
};

const getStatusBadgeVariant = (status?: string) =>
  status ? (PRODUCTION_PLAN_STATUS_BADGE_VARIANTS[status] ?? "info") : "info";

const getPriorityLabel = (priority?: string) => {
  if (!priority) return "-";
  return PRODUCTION_PLAN_PRIORITY_LABELS[priority] ?? priority;
};

const PRIORITY_TEXT_CLASS: Record<string, string> = {
  HIGH: "text-red-600 dark:text-red-400",
  MEDIUM: "text-yellow-600 dark:text-yellow-400",
  LOW: "text-green-600 dark:text-green-400",
};

const MATERIAL_STATUS_TEXT_CLASS: Record<string, string> = {
  SUFFICIENT: "text-green-600 dark:text-green-400",
  INSUFFICIENT: "text-red-600 dark:text-red-400",
};

const buildPlanSummary = (plans: ProductionPlanResponseDTO[]) => {
  const total = plans.length;
  const planConfirmedCount = plans.filter(
    (plan) => plan.status === "PLAN_CONFIRMED",
  ).length;
  const delayedCount = plans.filter((plan) => plan.status === "DELAYED").length;
  const materialShortageCount = plans.filter(
    (plan) => plan.materialAvailability === "INSUFFICIENT",
  ).length;
  const urgentCount = plans.filter(
    (plan) => typeof plan.dday === "number" && plan.dday <= 3,
  ).length;

  return {
    total,
    planConfirmedCount,
    delayedCount,
    materialShortageCount,
    urgentCount,
  };
};

const isUrgentPlan = (plan: ProductionPlanResponseDTO) =>
  typeof plan.dday === "number" && plan.dday <= 3 && plan.dday >= 0;

const getMaterialAvailabilityLabel = (value?: string) => {
  if (!value) return "-";
  return PRODUCTION_PLAN_MATERIAL_AVAILABILITY_LABELS[value] ?? value;
};

export type MrpBatchResultModalProps = {
  open: boolean;
  isLoading: boolean;
  error: string | null;
  plans: ProductionPlanResponseDTO[];
  onClose: () => void;
  onApply: () => void;
  isApplying: boolean;
};

export const MrpBatchResultModal = ({
  open,
  isLoading,
  error,
  plans,
  onClose,
  onApply,
  isApplying,
}: MrpBatchResultModalProps) => {
  const summary = buildPlanSummary(plans);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="MRP 실행 결과"
      widthClassName="max-w-6xl"
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
              {summary.materialShortageCount > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-200">
                      <i className="ri-alert-line" />
                    </div>
                    <div>
                      <p className="font-semibold">자재 부족 경고</p>
                      <p className="mt-1">
                        {summary.materialShortageCount}건의 계획에서 자재 부족이
                        감지되었습니다. 구매 요청 또는 재고 보충이 필요합니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    총 생산 주문
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {summary.total}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    계획 확정
                  </p>
                  <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    {summary.planConfirmedCount}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    자재 부족
                  </p>
                  <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                    {summary.materialShortageCount}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    긴급 주문
                  </p>
                  <p className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {summary.urgentCount}
                  </p>
                </div>
              </div>

              <div className="max-h-[55vh] space-y-4 overflow-y-auto pr-1">
                {plans.length > 0 ? (
                  plans.map((plan, index) => {
                    const displayKey = plan.orderCode ?? `plan-${index + 1}`;
                    const priorityLabel = getPriorityLabel(plan.priority);
                    const totalQuantity = calculateTotalQuantity(plan.items);
                    const materialAvailabilityLabel =
                      getMaterialAvailabilityLabel(plan.materialAvailability);
                    const materialAvailabilityBadgeVariant =
                      plan.materialAvailability
                        ? (PRODUCTION_PLAN_MATERIAL_AVAILABILITY_BADGE_VARIANTS[
                            plan.materialAvailability
                          ] ?? "info")
                        : "info";

                    return (
                      <div
                        key={`mrp-plan-${displayKey}`}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/80"
                      >
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {displayKey}
                            </h5>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                              {(plan.factoryName ?? "미지정 공장") +
                                " → " +
                                (plan.warehouseName ?? "미지정 창고")}
                              {" | 납기일: "}
                              {formatDate(plan.requiredDate)}
                              {typeof plan.dday === "number"
                                ? ` | ${plan.dday >= 0 ? `D-${plan.dday}` : `D+${Math.abs(plan.dday)}`}`
                                : ""}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(plan.status)}>
                              {getStatusLabel(plan.status)}
                            </Badge>
                            {isUrgentPlan(plan) && (
                              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                                긴급
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              우선순위
                            </span>
                            <p
                              className={`mt-1 font-medium ${PRIORITY_TEXT_CLASS[plan.priority ?? ""] ?? "text-gray-900 dark:text-gray-100"}`}
                            >
                              {priorityLabel}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              자재 상태
                            </span>
                            <p
                              className={`mt-1 font-medium ${MATERIAL_STATUS_TEXT_CLASS[plan.materialAvailability ?? ""] ?? "text-gray-900 dark:text-gray-100"}`}
                            >
                              {materialAvailabilityLabel}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              계획일
                            </span>
                            <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(plan.scheduledDate)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              총 생산 수량
                            </span>
                            <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                              {totalQuantity.toLocaleString("ko-KR")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              예정 시작일
                            </span>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                              {formatDate(plan.minimumStartDate)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              주문일
                            </span>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                              {formatDate(plan.orderDate)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              진행률
                            </span>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">
                              {typeof plan.progressRate === "number"
                                ? `${plan.progressRate}%`
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">
                              자재 배지
                            </span>
                            <div className="mt-1">
                              <Badge variant={materialAvailabilityBadgeVariant}>
                                {materialAvailabilityLabel || "정보 없음"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                          <div className="flex items-center justify-between">
                            <h6 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                              생산 품목
                            </h6>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Array.isArray(plan.items)
                                ? `${plan.items.length}개 품목`
                                : "품목 없음"}
                            </span>
                          </div>

                          <div className="mt-3 space-y-3">
                            {Array.isArray(plan.items) &&
                            plan.items.length > 0 ? (
                              plan.items.map((item, itemIndex) => {
                                if (!item) return null;
                                return (
                                  <div
                                    key={`mrp-plan-${displayKey}-item-${itemIndex}`}
                                    className="rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/80"
                                  >
                                    <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-gray-100">
                                      <span>
                                        {item.partName ?? "미지정 품목"}
                                      </span>
                                      <span className="text-gray-500 dark:text-gray-300">
                                        {item.partCode ?? "-"}
                                      </span>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600 sm:text-sm dark:text-gray-300">
                                      <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-200">
                                          분류
                                        </span>
                                        <p className="mt-1">
                                          {(item.partCategoryName ?? "-") +
                                            " > " +
                                            (item.partGroupName ?? "-")}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-200">
                                          필요 수량
                                        </span>
                                        <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                                          {typeof item.quantity === "number"
                                            ? `${item.quantity.toLocaleString("ko-KR")}개`
                                            : "-"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="rounded-md border border-dashed border-gray-300 bg-white p-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
                                등록된 품목 정보가 없습니다.
                              </div>
                            )}
                          </div>

                          {plan.materialAvailability === "INSUFFICIENT" && (
                            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
                              <div className="flex items-start space-x-3">
                                <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-200">
                                  <i className="ri-alert-line text-xs" />
                                </div>
                                <div>
                                  <p className="font-semibold">자재 부족</p>
                                  <p className="mt-1">
                                    생산에 필요한 자재가 부족합니다. 구매 요청
                                    또는 대체 자재 검토가 필요합니다.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
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
                error !== null || plans.length === 0 || isApplying || isLoading
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
