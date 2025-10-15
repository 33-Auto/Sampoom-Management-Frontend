import type { Schemas } from "@/shared/model";export type LoginRequest = Schemas["LoginRequest"];
export type LoginProfile = Schemas["UserLoginResponse"];

export type Workspace = LoginRequest["workspace"];

export const WORKSPACE_OPTIONS: { value: Workspace; label: string }[] = [
  { value: "PRODUCTION", label: "생산 관리" },
  { value: "INVENTORY", label: "재고 관리" },
  { value: "PURCHASE", label: "구매 관리" },
  { value: "SALES", label: "판매 관리" },
  { value: "MD", label: "기준 정보" },
  { value: "HR", label: "인사 관리" },
  { value: "AGENCY", label: "대리점" },
];

export interface LoginFormValues {
  email: string;
  password: string;
  workspace: Workspace | "";
}
