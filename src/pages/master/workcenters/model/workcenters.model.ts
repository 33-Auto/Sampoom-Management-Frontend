import type { Operations, Schemas } from "@/shared/model";export type WorkCenterListParams = Operations["list"]["parameters"]["query"];
export type WorkCenterListResponse =
  Schemas["ApiResponsePageResponseDtoWorkCenterResponseDTO"];
export type WorkCenterResponseDTO = Schemas["WorkCenterResponseDTO"];

export type WorkCenterType = NonNullable<WorkCenterListParams>["type"];
export type WorkCenterStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export const WORK_CENTER_TYPE = {
  INTERNAL: "INTERNAL",
  EXTERNAL: "EXTERNAL",
  undefined: undefined,
} as const satisfies Record<string, WorkCenterType | undefined>;

export const WORK_CENTER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  MAINTENANCE: "MAINTENANCE",
  undefined: undefined,
} as const satisfies Record<string, WorkCenterStatus | undefined>;
