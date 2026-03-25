import { api } from "@/shared/api";

// Branch 생성 Mutation
export const useCreateBranchMutation = () =>
  api.useMutation("post", "/api/site/branches");

// Branch 수정 Mutation (PUT)
export const useUpdateBranchMutation = () =>
  api.useMutation("put", "/api/site/branches/{id}");

// Branch 삭제 Mutation (deactivateBranch)
export const useDeleteBranchMutation = () =>
  api.useMutation("delete", "/api/site/branches/{id}");
