import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export const getRequestedOrders = async () => {
  const { data, error } = await fetchClient.GET("/api/order/requested" as any, {
    params: { query: { from: "warehouse" } },
  });

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
