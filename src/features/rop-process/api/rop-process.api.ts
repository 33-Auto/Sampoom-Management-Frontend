import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// 바뀐 내용이 목록에 보이도록 ROP 목록 캐시를 무효화한다
const useInvalidateRopList = () => {
  const queryClient = useQueryClient();
  return async (): Promise<void> =>
    queryClient.invalidateQueries({ queryKey: ["get", "/api/warehouse/rop"] });
};

// ROP 생성 Mutation
export const useCreateRopProcessMutation = () => {
  const invalidateRopList = useInvalidateRopList();
  return api.useMutation("post", "/api/warehouse/rop/create", {
    onSuccess: invalidateRopList,
  });
};

// ROP 수정 Mutation
export const useUpdateRopProcessMutation = () => {
  const invalidateRopList = useInvalidateRopList();
  return api.useMutation("patch", "/api/warehouse/rop", {
    onSuccess: invalidateRopList,
  });
};

// ROP 삭제 Mutation
export const useDeleteRopProcessMutation = () => {
  const invalidateRopList = useInvalidateRopList();
  return api.useMutation("delete", "/api/warehouse/rop/{ropId}", {
    onSuccess: invalidateRopList,
  });
};

// 타입 정의
export type RopReqDto = Schemas["RopReqDto"];
export type UpdateRopReqDto = Schemas["UpdateRopReqDto"];
