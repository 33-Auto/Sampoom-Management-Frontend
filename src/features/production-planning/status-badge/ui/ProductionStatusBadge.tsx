import {
  PRODUCTION_PLAN_STATUS_LABELS,
  type ProductionPlanStatus,
} from "@/pages/production/planning/model";
import { Badge } from "@/shared/ui";

type ProductionStatusBadgeProps = {
  status?: ProductionPlanStatus | string | null;
};

const STATUS_COLORS: Record<
  string,
  {
    text: string;
    bg: string;
    border: string;
  }
> = {
  UNDER_REVIEW: {
    text: "text-amber-700 dark:text-amber-200",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border border-amber-200 dark:border-amber-500/30",
  },
  PURCHASE_REQUEST: {
    text: "text-blue-700 dark:text-blue-200",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border border-blue-200 dark:border-blue-500/30",
  },
  PLAN_CONFIRMED: {
    text: "text-emerald-700 dark:text-emerald-200",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border border-emerald-200 dark:border-emerald-500/30",
  },
  DELAYED: {
    text: "text-red-700 dark:text-red-200",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border border-red-200 dark:border-red-500/30",
  },
  REJECTED: {
    text: "text-slate-700 dark:text-slate-200",
    bg: "bg-slate-100 dark:bg-slate-500/10",
    border: "border border-slate-200 dark:border-slate-500/30",
  },
  IN_PROGRESS: {
    text: "text-indigo-700 dark:text-indigo-200",
    bg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border border-indigo-200 dark:border-indigo-500/30",
  },
  COMPLETED: {
    text: "text-teal-700 dark:text-teal-200",
    bg: "bg-teal-50 dark:bg-teal-500/10",
    border: "border border-teal-200 dark:border-teal-500/30",
  },
};

export const ProductionStatusBadge = ({
  status,
}: ProductionStatusBadgeProps) => {
  const rawStatus =
    typeof status === "string" ? status.trim() : (status ?? "").toString();

  if (!rawStatus) {
    return <Badge variant="default">-</Badge>;
  }

  const normalizedStatus = rawStatus.toUpperCase();

  const label =
    PRODUCTION_PLAN_STATUS_LABELS[normalizedStatus] ??
    PRODUCTION_PLAN_STATUS_LABELS[rawStatus] ??
    rawStatus;

  const colorConfig =
    STATUS_COLORS[normalizedStatus] ?? STATUS_COLORS[rawStatus];

  if (!colorConfig) {
    return <Badge variant="default">{label}</Badge>;
  }

  return (
    <Badge
      variant="default"
      className={`${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
    >
      {label}
    </Badge>
  );
};
