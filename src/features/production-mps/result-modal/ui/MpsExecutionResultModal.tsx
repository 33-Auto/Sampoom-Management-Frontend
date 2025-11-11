import type { MpsPlanResult, PartOrderResult } from "@/entities/mps";
import { Badge, Button, Modal, Table } from "@/shared/ui";

const formatDate = (value?: string | null, withTime = false) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    ...(withTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  });
};

const formatNumber = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return value.toLocaleString("ko-KR");
};

const statusVariants: Record<string, "info" | "warning" | "success" | "error"> =
  {
    PLANNED: "info",
    PROCESSING: "warning",
    COMPLETED: "success",
    DELAYED: "error",
    CANCELLED: "error",
  };

const statusLabels: Record<string, string> = {
  PLANNED: "계획",
  PROCESSING: "진행중",
  COMPLETED: "완료",
  DELAYED: "지연",
  CANCELLED: "취소",
};

const orderStatusVariants: Record<
  string,
  "default" | "warning" | "error" | "success"
> = {
  UNDER_REVIEW: "warning",
  PURCHASE_REQUEST: "warning",
  PLAN_CONFIRMED: "info",
  DELAYED: "error",
  REJECTED: "error",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
};

const orderStatusLabels: Record<string, string> = {
  UNDER_REVIEW: "검토중",
  PURCHASE_REQUEST: "구매 요청",
  PLAN_CONFIRMED: "계획 확정",
  DELAYED: "지연",
  REJECTED: "반려",
  IN_PROGRESS: "진행중",
  COMPLETED: "완료",
};

const buildExecutionSummary = (plans: MpsPlanResult[]) => {
  const total = plans.length;
  const completed = plans.filter((plan) => plan.status === "COMPLETED").length;
  const inProgress = plans.filter(
    (plan) => plan.status === "IN_PROGRESS",
  ).length;
  const delayed = plans.filter((plan) => plan.status === "DELAYED").length;

  return {
    total,
    completed,
    inProgress,
    delayed,
  };
};

const buildConfirmSummary = (orders: PartOrderResult[]) => {
  const total = orders.length;
  const confirmed = orders.filter(
    (order) => order.status === "PLAN_CONFIRMED",
  ).length;
  const materialInsufficient = orders.filter(
    (order) => order.materialAvailability === "INSUFFICIENT",
  ).length;
  const completed = orders.filter(
    (order) => order.status === "COMPLETED",
  ).length;

  return {
    total,
    confirmed,
    materialInsufficient,
    completed,
  };
};

const executionColumns = [
  {
    key: "cycleNumber",
    title: "생산 주기",
    render: (value: unknown) =>
      typeof value === "number" ? `Cycle ${value}` : "-",
  },
  {
    key: "productionQuantity",
    title: "생산 수량",
    render: (value: unknown) =>
      typeof value === "number" ? formatNumber(value) : "-",
  },
  {
    key: "remainingTotalProduction",
    title: "잔여 생산량",
    render: (value: unknown) =>
      typeof value === "number" ? formatNumber(value) : "-",
  },
  {
    key: "requiredDate",
    title: "납기일",
    render: (value: unknown) =>
      typeof value === "string" ? formatDate(value) : "-",
  },
  {
    key: "status",
    title: "상태",
    render: (value: unknown) => {
      if (typeof value !== "string") {
        return "-";
      }
      const label = statusLabels[value] ?? value;
      const variant =
        statusVariants[value] ?? (label === "완료" ? "success" : "info");
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
];

const confirmColumns = [
  {
    key: "orderCode",
    title: "주문 코드",
  },
  {
    key: "warehouseName",
    title: "창고",
  },
  {
    key: "orderDate",
    title: "주문일",
    render: (value: unknown) =>
      typeof value === "string" ? formatDate(value, true) : "-",
  },
  {
    key: "requiredDate",
    title: "납기일",
    render: (value: unknown) =>
      typeof value === "string" ? formatDate(value, true) : "-",
  },
  {
    key: "materialAvailability",
    title: "자재 상태",
    render: (value: unknown) => {
      if (typeof value !== "string") {
        return "-";
      }
      const normalized = value.toUpperCase();
      const variant =
        normalized === "INSUFFICIENT"
          ? "error"
          : normalized === "SUFFICIENT"
            ? "success"
            : "default";
      const label =
        normalized === "INSUFFICIENT"
          ? "부족"
          : normalized === "SUFFICIENT"
            ? "충분"
            : value;
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    key: "status",
    title: "상태",
    render: (value: unknown) => {
      if (typeof value !== "string") {
        return "-";
      }
      const normalized = value.toUpperCase();
      const variant = orderStatusVariants[normalized] ?? "default";
      const label = orderStatusLabels[normalized] ?? value;
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
];

export type MpsResultModalMode = "execute" | "confirm";

export interface MpsExecutionResultModalProps {
  open: boolean;
  mode: MpsResultModalMode;
  isLoading: boolean;
  error: string | null;
  plans: MpsPlanResult[];
  orders: PartOrderResult[];
  onClose: () => void;
}

export const MpsExecutionResultModal = ({
  open,
  mode,
  isLoading,
  error,
  plans,
  orders,
  onClose,
}: MpsExecutionResultModalProps) => {
  const summary =
    mode === "execute"
      ? buildExecutionSummary(plans)
      : buildConfirmSummary(orders);

  const isEmpty = mode === "execute" ? plans.length === 0 : orders.length === 0;

  const title = mode === "execute" ? "MPS 실행 결과" : "MPS 확정 결과";

  const tableColumns = mode === "execute" ? executionColumns : confirmColumns;

  const tableData = mode === "execute" ? plans : orders;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      widthClassName="max-w-5xl"
    >
      {isLoading ? (
        <div className="flex flex-col items-center space-y-3 py-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-main-500 border-t-transparent" />
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {mode === "execute"
              ? "MPS 실행 중입니다..."
              : "MPS 확정 중입니다..."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            잠시만 기다려 주세요.
          </p>
        </div>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {mode === "execute" ? "총 생산 주기" : "총 주문"}
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                {summary.total}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {mode === "execute" ? "완료된 주기" : "계획 확정"}
              </p>
              <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                {mode === "execute" ? summary.completed : summary.confirmed}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {mode === "execute" ? "진행 중" : "자재 부족"}
              </p>
              <p className="mt-2 text-2xl font-bold text-orange-500 dark:text-orange-400">
                {mode === "execute"
                  ? summary.inProgress
                  : summary.materialInsufficient}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {mode === "execute" ? "지연" : "완료"}
              </p>
              <p className="mt-2 text-2xl font-bold text-red-500 dark:text-red-400">
                {mode === "execute" ? summary.delayed : summary.completed}
              </p>
            </div>
          </div>

          <Table
            columns={tableColumns}
            data={tableData}
            emptyText={
              isEmpty
                ? mode === "execute"
                  ? "생성된 생산 주기가 없습니다."
                  : "확정된 주문이 없습니다."
                : undefined
            }
          />

          <div className="flex justify-end">
            <Button variant="default" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
