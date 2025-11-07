import { queryClient } from "@/shared/api/base";
import type { Schemas } from "@/shared/model";

// BOM 상세 조회 Query
export const useBomDetailQuery = (
  bomId: number,
  options?: { enabled?: boolean },
) =>
  queryClient.useQuery(
    "get",
    "/api/part/boms/{bomId}",
    {
      params: {
        path: {
          bomId,
        },
      },
    },
    {
      enabled: options?.enabled !== false,
    },
  );

// BOM 생성 Mutation
export const useCreateBomProcessMutation = () =>
  queryClient.useMutation("post", "/api/part/boms");

// BOM 수정 Mutation
export const useUpdateBomProcessMutation = () =>
  queryClient.useMutation("put", "/api/part/boms/{bomId}");

// BOM 삭제 Mutation
export const useDeleteBomProcessMutation = () =>
  queryClient.useMutation("delete", "/api/part/boms/{bomId}");

// 타입 정의
export type BomRequestDTO = Schemas["BomRequestDTO"];
export type BomDetailResponseDTO = Schemas["BomDetailResponseDTO"];
