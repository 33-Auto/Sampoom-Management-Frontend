import { queryClient } from "@/shared/api";import type { Schemas } from "@/shared/model";// ROP 생성 Mutation
export const useCreateRopProcessMutation = () =>
  queryClient.useMutation("post", "/api/warehouse/rop/create");

// ROP 수정 Mutation
export const useUpdateRopProcessMutation = () =>
  queryClient.useMutation("patch", "/api/warehouse/rop");

// ROP 삭제 Mutation
export const useDeleteRopProcessMutation = () =>
  queryClient.useMutation("delete", "/api/warehouse/rop/{ropId}");

// 타입 정의
export type RopReqDto = Schemas["RopReqDto"];
export type UpdateRopReqDto = Schemas["UpdateRopReqDto"];
