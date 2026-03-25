import { api } from "@/shared/api";

// WorkCenter 생성 Mutation
export const useCreateWorkCenterMutation = () =>
  api.useMutation("post", "/api/part/work-centers");

// WorkCenter 수정 Mutation (PATCH)
export const useUpdateWorkCenterMutation = () =>
  api.useMutation("patch", "/api/part/work-centers/{id}");

// WorkCenter 삭제 Mutation
export const useDeleteWorkCenterMutation = () =>
  api.useMutation("delete", "/api/part/work-centers/{id}");
