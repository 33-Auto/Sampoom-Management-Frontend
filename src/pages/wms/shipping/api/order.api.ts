import { useQuery } from "@tanstack/react-query";

import { fetchClient, queryClient } from "@/shared/api";

export const getRequestedOrders = async () => {
  const { data, error } = await fetchClient.GET(
    "/api/warehouse/{warehouseId}/group/{groupId}",
    {
      params: {
        path: {
          warehouseId: 1,
          groupId: 1,
        },
      },
    },
  );

  if (error) {
    throw error;
  }
  return data || [];
};

export const requestedOrdersQueryOptions = {
  queryKey: ["warehouse", "orders"],
  queryFn: getRequestedOrders,
};

export const useGetRequestedOrdersQuery = () =>
  useQuery(requestedOrdersQueryOptions);

export const shippingListQueryOptions = (params?: {
  warehouseId?: number;
  keyword?: string;
  categoryId?: number;
  groupId?: number;
  quantityStatus?: "ENOUGH" | "SHORT" | "DANGER" | "OVER";
  page?: number;
  size?: number;
}) =>
  queryClient.queryOptions("get", "/api/warehouse/", {
    params: {
      query: {
        warehouseId: params?.warehouseId ?? 40,

        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    },
  });
