import type { Schemas } from "@/shared/model";

type SignupWorkspace = NonNullable<Schemas["SignupRequest"]["workspace"]>;

const BASE_WORKSPACE_LABELS = {
  PRODUCTION: "생산 관리",
  INVENTORY: "재고 관리",
  PURCHASE: "구매 관리",
  SALES: "판매 관리",
  MD: "기준 정보",
  HR: "인사 관리",
  AGENCY: "대리점",
} as const satisfies Record<SignupWorkspace, string>;

export const WORKSPACE_LABEL_MAP = {
  ...BASE_WORKSPACE_LABELS,
} as const;

export const WORKSPACE_OPTIONS = (
  Object.entries(BASE_WORKSPACE_LABELS) as [SignupWorkspace, string][]
).map(([value, label]) => ({
  value,
  label,
}));

export type WorkspaceLabelKey = keyof typeof WORKSPACE_LABEL_MAP;

export const getWorkspaceLabel = (
  workspace?: string,
  fallbackMap: Record<string, string> = {},
) => {
  if (!workspace) {
    return "-";
  }

  return (
    WORKSPACE_LABEL_MAP[workspace as WorkspaceLabelKey] ??
    fallbackMap[workspace] ??
    workspace
  );
};
