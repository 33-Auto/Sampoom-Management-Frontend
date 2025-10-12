import type { PartnerListParams } from "@/pages/master/partners/model";import { queryClient } from "@/shared/api";// 공통 옵션 생성 함수
const getPartnersQueryOptions = (params?: PartnerListParams) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      keyword: params?.keyword,
      status: params?.status,
    },
  },
});

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const partnersListQueryOptions = (params?: PartnerListParams) =>
  queryClient.queryOptions(
    "get",
    "/api/site/vendors/search",
    getPartnersQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const usePartnersQuery = (params?: PartnerListParams) =>
  queryClient.useQuery(
    "get",
    "/api/site/vendors/search",
    getPartnersQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
    },
  );
