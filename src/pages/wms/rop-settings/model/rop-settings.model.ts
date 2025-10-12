import type { Operations, Schemas } from "@/shared/model";export type RopSettingsListParams =
  Operations["getRops"]["parameters"]["query"];

export type RopSettingsListResponse = Schemas["ApiResponsePageRopResDto"];
export type RopResDto = Schemas["RopResDto"];

export type RopSettingStatus = "활성" | "비활성";
