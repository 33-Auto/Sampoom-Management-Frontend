import { queryClient } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type BomCreateRequestDTO = Schemas["BomRequestDTO"];
export type BomUpdateRequestDTO = Schemas["BomRequestDTO"];

// Create mutation
export const useCreateBomMutation = () =>
  queryClient.useMutation("post", "/api/part/boms");

// Update mutation (PUT 사용)
export const useUpdateBomMutation = () =>
  queryClient.useMutation("put", "/api/part/boms/{bomId}");

// Delete mutation
export const useDeleteBomMutation = () =>
  queryClient.useMutation("delete", "/api/part/boms/{bomId}");
