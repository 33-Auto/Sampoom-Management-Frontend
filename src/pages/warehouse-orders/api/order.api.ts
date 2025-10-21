import { GET } from "@/shared/api";

export const getRequestedOrders = async () => {
  const { data, error } = await GET("/api/order/requested", {
    params: { query: { from: "warehouse" } },
  });

  if (error) {
    throw error;
  }
  return data;
};
