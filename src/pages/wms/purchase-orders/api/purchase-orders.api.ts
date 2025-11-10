import type { PurchaseOrderListParams } from "@/pages/wms/purchase-orders/model";
import { queryClient } from "@/shared/api";

type PurchaseOrderListQueryParams = Partial<PurchaseOrderListParams> & {
  warehouseId?: number;
};

// 공통 옵션 생성 함수
const getPurchaseOrderQueryOptions = (
  params?: PurchaseOrderListQueryParams,
) => {
  const warehouseId =
    typeof params?.warehouseId === "number" ? params.warehouseId : Number.NaN;

  const query: PurchaseOrderListParams = {
    warehouseId,
    page: params?.page ?? 0,
    size: params?.size ?? 10,
    keyword: params?.keyword,
    categoryId: params?.categoryId,
    groupId: params?.groupId,
    status: params?.status,
  };

  return {
    params: {
      query,
    },
  };
};

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const purchaseOrderListQueryOptions = (
  params?: PurchaseOrderListQueryParams,
) =>
  queryClient.queryOptions(
    "get",
    "/api/warehouse/po",
    getPurchaseOrderQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const usePurchaseOrderQuery = (params?: PurchaseOrderListQueryParams) =>
  queryClient.useQuery(
    "get",
    "/api/warehouse/po",
    getPurchaseOrderQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
      enabled: typeof params?.warehouseId === "number",
    },
  );

export type { PurchaseOrderListQueryParams };
