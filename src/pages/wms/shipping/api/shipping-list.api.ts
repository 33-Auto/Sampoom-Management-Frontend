import type { ShippingListParams } from "@/pages/wms/shipping/model";
import { queryClient } from "@/shared/api";

const DEFAULT_WAREHOUSE_ID = 168;

const getShippingListQueryOptions = (params?: ShippingListParams) => ({
  params: {
    query: {
      warehouseId: params?.warehouseId ?? DEFAULT_WAREHOUSE_ID,
      categoryId: params?.categoryId,
      groupId: params?.groupId,
      keyword: params?.keyword,
      status: params?.status,
      page: params?.page ?? 0,
      size: params?.size ?? 10,
    },
  },
});

export const shippingListQueryOptions = (params?: ShippingListParams) =>
  queryClient.queryOptions(
    "get",
    "/api/order/outbound",
    getShippingListQueryOptions(params),
  );

export const useShippingListQuery = (params: ShippingListParams) =>
  queryClient.useQuery(
    "get",
    "/api/order/outbound",
    getShippingListQueryOptions(params),
    {
      placeholderData: (previousData) => previousData,
    },
  );
