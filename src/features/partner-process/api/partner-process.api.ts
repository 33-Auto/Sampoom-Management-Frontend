import { api } from "@/shared/api";

// Partner 생성 Mutation
export const useCreatePartnerMutation = () =>
  api.useMutation("post", "/api/site/vendors");

// Partner 수정 Mutation (PATCH)
export const useUpdatePartnerMutation = () =>
  api.useMutation("put", "/api/site/vendors/{id}");

// Partner 삭제 Mutation
export const useDeletePartnerMutation = () =>
  api.useMutation("delete", "/api/site/vendors/{id}");
