import type { Operations, Schemas } from "@/shared/model";export type RoutingListParams = Operations["search1"]["parameters"]["query"];
export type RoutingListResponse =
  Schemas["ApiResponsePageResponseDtoProcessResponseDTO"];
export type ProcessResponseDTO = Schemas["ProcessResponseDTO"];
export type ProcessCreateRequestDTO = Schemas["ProcessCreateRequestDTO"];
export type ProcessUpdateRequestDTO = Schemas["ProcessUpdateRequestDTO"];
export type ProcessStepCreateRequestDTO =
  Schemas["ProcessStepCreateRequestDTO"];
export type ProcessStepResponseDTO = Schemas["ProcessStepResponseDTO"];

export type RoutingStatus = NonNullable<RoutingListParams>["status"];

export const ROUTING_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  undefined: undefined,
} as const satisfies Record<string, RoutingStatus | undefined>;
