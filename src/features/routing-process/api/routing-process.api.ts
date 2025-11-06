import { queryClient } from "@/shared/api/base";

// Routing 생성 Mutation
export const useCreateRoutingMutation = () =>
  queryClient.useMutation("post", "/api/part/processes");

// Routing 수정 Mutation (PUT)
export const useUpdateRoutingMutation = () =>
  queryClient.useMutation("put", "/api/part/processes/{id}");

// Routing 삭제 Mutation
export const useDeleteRoutingMutation = () =>
  queryClient.useMutation("delete", "/api/part/processes/{id}");
