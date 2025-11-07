import type { Schemas, Operations } from "@/shared/model";

export type ItemsMasterParams =
  Operations["searchItems"]["parameters"]["query"];

export type ItemResponseDTO = Schemas["ItemResponseDTO"];
