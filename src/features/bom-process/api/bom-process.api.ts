import { api } from "@/shared/api";
import type { Schemas } from "@/shared/model";

// BOM 상세 조회 Query
export const useBomDetailQuery = (
  bomId?: number,
  options?: { enabled?: boolean },
) => {
  const hasValidBomId = typeof bomId === "number" && !Number.isNaN(bomId);

  return api.useQuery(
    "get",
    "/api/part/boms/{bomId}",
    hasValidBomId
      ? {
          params: {
            path: {
              bomId,
            },
          },
        }
      : {
          params: {
            path: {
              bomId: 0,
            },
          },
        },
    {
      enabled: hasValidBomId && (options?.enabled ?? true),
    },
  );
};

// BOM 생성 Mutation
export const useCreateBomProcessMutation = () =>
  api.useMutation("post", "/api/part/boms");

// BOM 수정 Mutation
export const useUpdateBomProcessMutation = () =>
  api.useMutation("put", "/api/part/boms/{bomId}");

// BOM 삭제 Mutation
export const useDeleteBomProcessMutation = () =>
  api.useMutation("delete", "/api/part/boms/{bomId}");

// 타입 정의
export type BomRequestDTO = Schemas["BomRequestDTO"];
export type BomDetailResponseDTO = Schemas["BomDetailResponseDTO"];
