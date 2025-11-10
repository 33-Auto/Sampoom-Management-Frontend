import type {
  SalesOrderDto,
  SalesOrderListParams,
  SalesOrderListResponse,
} from "@/pages/sales/orders/model";
import { queryClient } from "@/shared/api";

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;

export const getSalesOrdersQueryOptions = ({
  warehouseId,
  page,
  size,
  status,
  from,
}: SalesOrderListParams) => ({
  params: {
    path: { warehouseId },
    query: {
      page: page ?? DEFAULT_PAGE,
      size: size ?? DEFAULT_SIZE,
      status,
      // TODO(from-filter): 대리점 검색 파라미터 처리 로직 정리 후 반영
      from,
    },
  },
});

export const salesOrdersListQueryOptions = (params: SalesOrderListParams) =>
  queryClient.queryOptions(
    "get",
    "/api/order/warehouse/{warehouseId}",
    getSalesOrdersQueryOptions(params),
  );

export const useSalesOrdersQuery = (params: SalesOrderListParams) =>
  queryClient.useQuery(
    "get",
    "/api/order/warehouse/{warehouseId}",
    getSalesOrdersQueryOptions(params),
    {
      placeholderData: (previousData) => previousData,
    },
  );

export type SalesOrderListData = SalesOrderListResponse["data"];

export type SalesOrderListItem = SalesOrderDto;
