import type { PurchaseRequestListParams } from "@/pages/purchasing/requests/model";
import { api } from "@/shared/api";

// 공통 옵션 생성 함수
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

export const purchaseRequestListQueryOptions = (
  params?: PurchaseRequestListParams,
) =>
  api.queryOptions(
    "get",
    "/api/purchase/",
    getPurchaseRequestQueryOptions(params),
  );

export const usePurchaseRequestQuery = (params?: PurchaseRequestListParams) =>
  api.useQuery(
    "get",
    "/api/purchase/",
    getPurchaseRequestQueryOptions(params),
    {
      placeholderData: (previousData: any) => previousData,
    },
  );
