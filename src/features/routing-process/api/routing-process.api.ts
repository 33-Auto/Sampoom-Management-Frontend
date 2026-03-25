import { api } from "@/shared/api";

// Routing 생성 Mutation
export const useCreateRoutingMutation = () =>
  api.useMutation("post", "/api/part/processes");

// Routing 수정 Mutation (PUT)
export const useUpdateRoutingMutation = () =>
  api.useMutation("put", "/api/part/processes/{id}");

// Routing 삭제 Mutation
export const useDeleteRoutingMutation = () =>
  api.useMutation("delete", "/api/part/processes/{id}");
