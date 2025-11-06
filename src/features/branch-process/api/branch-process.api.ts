import { queryClient } from "@/shared/api/base";

// Branch 생성 Mutation
export const useCreateBranchMutation = () =>
  queryClient.useMutation("post", "/api/site/branches");

// Branch 수정 Mutation (PUT)
export const useUpdateBranchMutation = () =>
  queryClient.useMutation("put", "/api/site/branches/{id}");

// Branch 삭제 Mutation (deactivateBranch)
export const useDeleteBranchMutation = () =>
  queryClient.useMutation("delete", "/api/site/branches/{id}");
