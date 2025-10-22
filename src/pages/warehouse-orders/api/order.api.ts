import { GET, queryClient } from "@/shared/api";

export const getRequestedOrders = async () => {
  const { data, error } = await GET("/api/order/requested", {
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
