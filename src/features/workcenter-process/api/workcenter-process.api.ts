import { queryClient } from "@/shared/api";// WorkCenter 생성 Mutation
export const useCreateWorkCenterMutation = () =>
  queryClient.useMutation("post", "/api/part/work-centers");

// WorkCenter 수정 Mutation (PATCH)
export const useUpdateWorkCenterMutation = () =>
  queryClient.useMutation("patch", "/api/part/work-centers/{id}");

// WorkCenter 삭제 Mutation
export const useDeleteWorkCenterMutation = () =>
  queryClient.useMutation("delete", "/api/part/work-centers/{id}");
