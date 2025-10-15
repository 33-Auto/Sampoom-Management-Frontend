import type { BomListParams } from "@/pages/master/bom/model";import { queryClient } from "@/shared/api";// 공통 옵션 생성 함수
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

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const bomsListQueryOptions = (params?: BomListParams) =>
  queryClient.queryOptions(
    "get",
    "/api/part/boms/search",
    getBomsQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useBomsQuery = (params?: BomListParams) =>
  queryClient.useQuery(
    "get",
    "/api/part/boms/search",
    getBomsQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
    },
  );
