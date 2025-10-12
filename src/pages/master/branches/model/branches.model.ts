import type { Operations, Schemas } from "@/shared/model";export type BranchListParams =
  Operations["searchBranches"]["parameters"]["query"];
export type BranchListResponse =
  Schemas["ApiResponsePageResponseDTOBranchListResponseDTO"];
export type BranchResponseDTO = Schemas["BranchListResponseDTO"];

export type BranchType = "WAREHOUSE" | "FACTORY";
export type BranchStatus = "ACTIVE" | "INACTIVE";

export const BRANCH_TYPE = {
  WAREHOUSE: "WAREHOUSE",
  FACTORY: "FACTORY",
  undefined: undefined,
} as const satisfies Record<string, BranchType | undefined>;

export const BRANCH_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  undefined: undefined,
} as const satisfies Record<string, BranchStatus | undefined>;
