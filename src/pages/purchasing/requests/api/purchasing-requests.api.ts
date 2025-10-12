import type { PurchaseRequestListParams } from "@/pages/purchasing/requests/model";import { queryClient } from "@/shared/api";// 공통 옵션 생성 함수
const getPurchaseRequestQueryOptions = (
  params?: PurchaseRequestListParams,
) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      status: params?.status,
      urgency: params?.urgency,
      query: params?.query,
    },
  },
});

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const purchaseRequestListQueryOptions = (
  params?: PurchaseRequestListParams,
) =>
  queryClient.queryOptions(
    "get",
    "/api/purchase/",
    getPurchaseRequestQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const usePurchaseRequestQuery = (params?: PurchaseRequestListParams) =>
  queryClient.useQuery(
    "get",
    "/api/purchase/",
    getPurchaseRequestQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
    },
  );
