import { api } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type BranchCreateRequestDTO = Schemas["BranchRequestDTO"];
export type BranchUpdateRequestDTO = Schemas["BranchUpdateRequestDTO"];

// Create mutation
export const useCreateBranchMutation = () =>
  api.useMutation("post", "/api/site/branches");

export const useUpdateBranchMutation = () =>
  api.useMutation("put", "/api/site/branches/{id}");

export const useDeleteBranchMutation = () =>
  api.useMutation("delete", "/api/site/branches/{id}");
