import type { MaterialListParams } from "@/pages/master/bom/model";
import { queryClient } from "@/shared/api";

// 공통 옵션 생성 함수
const getMaterialsQueryOptions = (params?: MaterialListParams) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      keyword: params?.keyword,
      categoryId: params?.categoryId,
    },
  },
});

// queryOptions를 반환하는 함수
export const materialsListQueryOptions = (params?: MaterialListParams) =>
  queryClient.queryOptions(
    "get",
    "/api/part/materials/search",
    getMaterialsQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useMaterialsQuery = (params?: MaterialListParams) =>
  queryClient.useQuery(
    "get",
    "/api/part/materials/search",
    getMaterialsQueryOptions(params),
    {
      placeholderData: (previousData) => previousData,
    },
  );
