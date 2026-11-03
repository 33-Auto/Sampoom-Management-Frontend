import { useQueryClient } from "@tanstack/react-query";

import type {
  SalesOrderDto,
  SalesOrderListParams,
  SalesOrderListResponse,
} from "@/pages/sales/orders/model";
import { api } from "@/shared/api";

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;

type SalesOrderListQueryParams = Partial<SalesOrderListParams> & {
  warehouseId?: number;
};

export const getSalesOrdersQueryOptions = (
  params?: SalesOrderListQueryParams,
) => {
  return {
    params: {
      path: {
        warehouseId: params?.warehouseId as number,
      },
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
  api.queryOptions(
    "get",
    "/api/order/warehouse/{warehouseId}",
    getSalesOrdersQueryOptions(params),
  );

export const useSalesOrdersQuery = (params?: SalesOrderListQueryParams) =>
  api.useQuery(
    "get",
    "/api/order/warehouse/{warehouseId}",
    getSalesOrdersQueryOptions(params),
    {
      placeholderData: (previousData: any) => previousData,
      enabled: typeof params?.warehouseId === "number",
    },
  );

export const salesOrderDetailQueryOptions = (orderId: number) =>
  api.queryOptions("get", "/api/order/{orderId}", {
    params: {
      path: {
        orderId,
      },
    },
  });

export const useSalesOrderDetailQuery = (orderId?: number) =>
  api.useQuery(
    "get",
    "/api/order/{orderId}",
    {
      params: {
        path: {
          orderId: (orderId as number) ?? 0,
        },
      },
    },
    {
      enabled: typeof orderId === "number",
    },
  );

// 취소 뒤 목록과 상세가 바뀐 상태를 다시 받는다
export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return api.useMutation("patch", "/api/order/cancel/{orderId}", {
    onSuccess: async () => {
      await Promise.all([
        // 목록은 화면에 없어도 바로 다시 받아 복귀 때 옛 상태가 안 보인다
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/order/warehouse/{warehouseId}"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["get", "/api/order/{orderId}"],
        }),
      ]);
    },
  });
};

export type SalesOrderListData = SalesOrderListResponse["data"];

export type SalesOrderListItem = SalesOrderDto;

export type { SalesOrderListQueryParams };
