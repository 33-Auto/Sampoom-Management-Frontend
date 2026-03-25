import { api } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type BomCreateRequestDTO = Schemas["BomRequestDTO"];
export type BomUpdateRequestDTO = Schemas["BomRequestDTO"];

// Create mutation
export const useCreateBomMutation = () =>
  api.useMutation("post", "/api/part/boms");

export const useUpdateBomMutation = () =>
  api.useMutation("put", "/api/part/boms/{bomId}");

export const useDeleteBomMutation = () =>
  api.useMutation("delete", "/api/part/boms/{bomId}");
