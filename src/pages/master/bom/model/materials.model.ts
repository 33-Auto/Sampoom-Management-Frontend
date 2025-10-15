import type { Operations, Schemas } from "@/shared/model";export type MaterialListParams =
  Operations["searchMaterials"]["parameters"]["query"];
export type MaterialListResponse =
  Schemas["ApiResponsePageResponseDTOMaterialResponseDTO"];
export type MaterialResponseDTO = Schemas["MaterialResponseDTO"];
