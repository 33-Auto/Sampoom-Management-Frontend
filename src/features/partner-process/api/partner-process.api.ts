import { queryClient } from "@/shared/api";// Partner 생성 Mutation
export const useCreatePartnerMutation = () =>
  queryClient.useMutation("post", "/api/site/vendors");

// Partner 수정 Mutation (PATCH)
export const useUpdatePartnerMutation = () =>
  queryClient.useMutation("put", "/api/site/vendors/{id}");

// Partner 삭제 Mutation
export const useDeletePartnerMutation = () =>
  queryClient.useMutation("delete", "/api/site/vendors/{id}");
