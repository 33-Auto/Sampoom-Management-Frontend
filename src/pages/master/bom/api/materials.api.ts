import type { MaterialListParams } from "@/pages/master/bom/model";
import { api } from "@/shared/api";

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

export const materialsListQueryOptions = (params?: MaterialListParams) =>
  api.queryOptions(
    "get",
    "/api/part/materials",
    getMaterialsQueryOptions(params),
  );

export const useMaterialsQuery = (params?: MaterialListParams) =>
  api.useQuery("get", "/api/part/materials", getMaterialsQueryOptions(params), {
    placeholderData: (previousData: any) => previousData,
  });
