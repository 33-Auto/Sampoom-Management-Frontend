import { api } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type ProcessCreateRequestDTO = Schemas["ProcessCreateRequestDTO"];
export type ProcessUpdateRequestDTO = Schemas["ProcessUpdateRequestDTO"];

// Create mutation
export const useCreateRouting = () =>
  api.useMutation("post", "/api/part/processes");

export const useUpdateRouting = () =>
  api.useMutation("put", "/api/part/processes/{id}");

export const useDeleteRouting = () =>
  api.useMutation("delete", "/api/part/processes/{id}");
