import type { ShippingListParams } from "@/entities/shipping";
import { api } from "@/shared/api";

type ShippingListQueryParams = Partial<ShippingListParams> & {
  warehouseId?: number;
};

const getShippingListQueryOptions = (params?: ShippingListQueryParams) => {
  const query: ShippingListParams = {
    warehouseId:
      typeof params?.warehouseId === "number" ? params.warehouseId : Number.NaN,
    categoryId: params?.categoryId,
    groupId: params?.groupId,
    keyword: params?.keyword,
    status: params?.status,
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  };

  return {
    params: {
      query,
      cookie: {} as { ACCESS_TOKEN: string },
    },
  };
};

export const shippingListQueryOptions = (params?: ShippingListQueryParams) =>
  api.queryOptions(
    "get",
    "/api/order/outbound",
    getShippingListQueryOptions(params),
  );

export const useShippingListQuery = (params?: ShippingListQueryParams) =>
  api.useQuery(
    "get",
    "/api/order/outbound",
    getShippingListQueryOptions(params),
    {
      placeholderData: (previousData) => previousData,
      enabled: typeof params?.warehouseId === "number",
    },
  );

export type { ShippingListQueryParams };
