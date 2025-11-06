import { queryClient } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type BranchCreateRequestDTO = Schemas["BranchRequestDTO"];
export type BranchUpdateRequestDTO = Schemas["BranchUpdateRequestDTO"];

// Create mutation
export const useCreateBranchMutation = () =>
  queryClient.useMutation("post", "/api/site/branches");

// Update mutation (PUT 사용)
export const useUpdateBranchMutation = () =>
  queryClient.useMutation("put", "/api/site/branches/{id}");

// Delete mutation (deactivateBranch)
export const useDeleteBranchMutation = () =>
  queryClient.useMutation("delete", "/api/site/branches/{id}");
