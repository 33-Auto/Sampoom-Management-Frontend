import type { Schemas, Operations } from "@/shared/model";

export type PartnerListParams =
  Operations["searchVendors"]["parameters"]["query"];
export type PartnerListResponse =
  Schemas["ApiResponsePageResponseDTOVendorListResponseDTO"];
export type PartnerResponseDTO = Schemas["VendorListResponseDTO"];

export type PartnerStatus = "ACTIVE" | "INACTIVE";

export const PARTNER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  undefined: undefined,
} as const satisfies Record<string, PartnerStatus | undefined>;
