import { queryClient } from "@/shared/api";import type { Schemas } from "@/shared/model";// 타입 정의 (OpenAPI에서 가져오기)
export type ProcessCreateRequestDTO = Schemas["ProcessCreateRequestDTO"];
export type ProcessUpdateRequestDTO = Schemas["ProcessUpdateRequestDTO"];

// Create mutation
export const useCreateRouting = () =>
  queryClient.useMutation("post", "/api/part/processes");

// Update mutation (PUT 사용)
export const useUpdateRouting = () =>
  queryClient.useMutation("put", "/api/part/processes/{id}");

// Delete mutation
export const useDeleteRouting = () =>
  queryClient.useMutation("delete", "/api/part/processes/{id}");
