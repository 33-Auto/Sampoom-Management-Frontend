import type { WorkCenterListParams } from "@/pages/master/workcenters/model";
import { queryClient } from "@/shared/api";

// 공통 옵션 생성 함수
const getWorkCentersQueryOptions = (params?: WorkCenterListParams) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      query: params?.query,
      type: params?.type,
      status: params?.status,
    },
  },
});

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const workCentersListQueryOptions = (params?: WorkCenterListParams) =>
  queryClient.queryOptions(
    "get",
    "/api/part/work-centers",
    getWorkCentersQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useWorkCentersQuery = (params?: WorkCenterListParams) =>
  queryClient.useQuery(
    "get",
    "/api/part/work-centers",
    getWorkCentersQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
    },
  );
