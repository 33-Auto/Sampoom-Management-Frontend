import { fetchClient, queryClient } from "@/shared/api";

export const getRequestedOrders = async () => {
  const { data, error } = await fetchClient.GET("/api/order/requested", {
    params: { query: { from: "warehouse" } },
  });

  if (error) {
    throw error;
  }
  return data;
};

export const useGetRequestedOrdersQuery = () =>
  queryClient.useQuery("get", "/api/order/requested", {
    params: { query: { from: "warehouse" } },
  });
