import type { Schemas, Operations } from "@/shared/model";

export type BomListParams = Operations["searchBoms"]["parameters"]["query"];
export type BomListResponse =
  Schemas["ApiResponsePageResponseDTOBomResponseDTO"];
export type BomResponseDTO = Schemas["BomResponseDTO"];
export type BomDetailResponseDTO = Schemas["BomDetailResponseDTO"];

export type BomStatus =
  | "ACTIVE"
  | "REVIEWING"
  | "INACTIVE"
  | "PENDING_APPROVAL";
export type BomComplexity = "SIMPLE" | "NORMAL" | "COMPLEX";

export const BOM_STATUS = {
  ACTIVE: "ACTIVE",
  REVIEWING: "REVIEWING",
  INACTIVE: "INACTIVE",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  undefined: undefined,
} as const satisfies Record<string, BomStatus | undefined>;

export const BOM_COMPLEXITY = {
  SIMPLE: "SIMPLE",
  NORMAL: "NORMAL",
  COMPLEX: "COMPLEX",
  undefined: undefined,
} as const satisfies Record<string, BomComplexity | undefined>;
