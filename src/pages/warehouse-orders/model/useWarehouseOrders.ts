import { useState, useEffect } from "react";

import type { OrderResDto } from "@/shared/api/models";

import { getRequestedOrders } from "../api/order.api";

export function useWarehouseOrders() {
  const [orders, setOrders] = useState<OrderResDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getRequestedOrders();
        if (response && response.data) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, isLoading, error };
}
