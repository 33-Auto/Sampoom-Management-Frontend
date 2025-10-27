import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export const getWarehouseInventory = async () => {
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

  console.log("Inventory Data:", data);
  return data || [];
};

export const warehouseInventoryQueryOptions = {
  queryKey: ["warehouse", "inventory"],
  queryFn: getWarehouseInventory,
};

export const useWarehouseInventoryQuery = () =>
  useQuery(warehouseInventoryQueryOptions);
