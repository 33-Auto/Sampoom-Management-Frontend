import { queryClient } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 타입 정의 (OpenAPI에서 가져오기)
export type WorkCenterCreateRequestDTO = Schemas["WorkCenterCreateRequestDTO"];
export type WorkCenterUpdateRequestDTO = Schemas["WorkCenterUpdateRequestDTO"];

// Create mutation
export const useCreateWorkCenter = () =>
  queryClient.useMutation("post", "/api/part/work-centers");

// Update mutation (PATCH 사용)
export const useUpdateWorkCenter = () =>
  queryClient.useMutation("patch", "/api/part/work-centers/{id}");

// Delete mutation
export const useDeleteWorkCenter = () =>
  queryClient.useMutation("delete", "/api/part/work-centers/{id}");
