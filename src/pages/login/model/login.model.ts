import type { Schemas } from "@/shared/model";

export type LoginRequest = Schemas["LoginRequest"];
export type LoginProfile = Schemas["UserLoginResponse"];

export type Workspace = LoginRequest["workspace"];

export const WORKSPACE_OPTIONS: { value: Workspace; label: string }[] = [
  { value: "FACTORY", label: "공장" },
  { value: "WAREHOUSE", label: "창고" },
  { value: "AGENCY", label: "대리점" },
];

export interface LoginFormValues {
  email: string;
  password: string;
  workspace: Workspace | "";
}
