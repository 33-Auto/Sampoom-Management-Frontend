import { WORKSPACE_OPTIONS } from "@/shared/constants/workspace";
import type { Schemas } from "@/shared/model";

export type SignupRequest = Schemas["SignupRequest"];
export type SignupResponse = Schemas["SignupResponse"];

export type Workspace = SignupRequest["workspace"];
export type Position = SignupRequest["position"];

export { WORKSPACE_OPTIONS };

export const POSITION_OPTIONS: {
  value: NonNullable<Position>;
  label: string;
}[] = [
  { value: "STAFF", label: "사원" },
  { value: "SENIOR_STAFF", label: "주임" },
  { value: "ASSISTANT_MANAGER", label: "대리" },
  { value: "MANAGER", label: "과장" },
  { value: "DEPUTY_GENERAL_MANAGER", label: "차장" },
  { value: "GENERAL_MANAGER", label: "부장" },
  { value: "DIRECTOR", label: "이사" },
  { value: "VICE_PRESIDENT", label: "부사장" },
  { value: "PRESIDENT", label: "사장" },
  { value: "CHAIRMAN", label: "회장" },
];

export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
  workspace: Workspace | "";
  branch: string;
  position: Position | "";
}
