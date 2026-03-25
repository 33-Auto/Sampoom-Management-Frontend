import type { RoutingListParams } from "@/entities/routing";
import { api } from "@/shared/api";

// 공통 옵션 생성 함수
const getRoutingsQueryOptions = (params?: RoutingListParams) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      query: params?.query,
      status: params?.status,
      categoryId: params?.categoryId,
      groupId: params?.groupId,
    },
  },
});

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const routingsListQueryOptions = (params?: RoutingListParams) =>
  api.queryOptions(
    "get",
    "/api/part/processes",
    getRoutingsQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useRoutingsQuery = (params?: RoutingListParams) =>
  api.useQuery("get", "/api/part/processes", getRoutingsQueryOptions(params), {
    placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
  });
