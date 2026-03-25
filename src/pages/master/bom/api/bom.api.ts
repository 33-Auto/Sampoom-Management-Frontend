import type { BomListParams } from "@/pages/master/bom/model";
import { api } from "@/shared/api";

// 공통 옵션 생성 함수
const getBomsQueryOptions = (params?: BomListParams) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      keyword: params?.keyword,
      categoryId: params?.categoryId,
      groupId: params?.groupId,
      status: params?.status,
      complexity: params?.complexity,
    },
  },
});

export const bomsListQueryOptions = (params?: BomListParams) =>
  api.queryOptions("get", "/api/part/boms", getBomsQueryOptions(params));

export const useBomsQuery = (params?: BomListParams) =>
  api.useQuery("get", "/api/part/boms", getBomsQueryOptions(params), {
    placeholderData: (previousData: any) => previousData,
  });
