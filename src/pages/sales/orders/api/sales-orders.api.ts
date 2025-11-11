import type {
  SalesOrderDto,
  SalesOrderListParams,
  SalesOrderListResponse,
} from "@/pages/sales/orders/model";
import { queryClient } from "@/shared/api";

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;

type SalesOrderListQueryParams = Partial<SalesOrderListParams> & {
  warehouseId?: number;
};

export const getSalesOrdersQueryOptions = (
  params?: SalesOrderListQueryParams,
) => {
  const warehouseId =
    typeof params?.warehouseId === "number" ? params.warehouseId : Number.NaN;

  return {
    params: {
      path: { warehouseId },
      query: {
        page: params?.page ?? DEFAULT_PAGE,
        size: params?.size ?? DEFAULT_SIZE,
        status: params?.status,
        // TODO(from-filter): 대리점 검색 파라미터 처리 로직 정리 후 반영
        from: params?.from ?? undefined,
      },
    },
  };
};

export const salesOrdersListQueryOptions = (
  params?: SalesOrderListQueryParams,
) =>
  queryClient.queryOptions(
    "get",
    "/api/order/warehouse/{warehouseId}",
    getSalesOrdersQueryOptions(params),
  );

export const useSalesOrdersQuery = (params?: SalesOrderListQueryParams) =>
  queryClient.useQuery(
    "get",
    "/api/order/warehouse/{warehouseId}",
    getSalesOrdersQueryOptions(params),
    {
      placeholderData: (previousData) => previousData,
      enabled: typeof params?.warehouseId === "number",
    },
  );

export const salesOrderDetailQueryOptions = (orderId: number) =>
  queryClient.queryOptions("get", "/api/order/{orderId}", {
    params: {
      path: { orderId },
    },
  });

export const useSalesOrderDetailQuery = (orderId?: number) =>
  queryClient.useQuery("get", "/api/order/{orderId}", {
    params: {
      path: { orderId: orderId as number },
    },
    enabled: typeof orderId === "number" && !Number.isNaN(orderId),
  });

export const useCancelOrderMutation = () =>
  queryClient.useMutation("patch", "/api/order/cancel/{orderId}");

export type SalesOrderListData = SalesOrderListResponse["data"];

export type SalesOrderListItem = SalesOrderDto;

export type { SalesOrderListQueryParams };
