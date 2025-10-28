import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface ItemMaster {
  itemCode: string;
  itemName: string;
  category: string;
  itemType: string;
  procurementType: string;
  purchaseLeadTime: number | null;
  productionLeadTime: number | null;
  calculatedProductionLeadTime: number | null;
  unit: string;
  standardPrice: number;
  currentStock: number;
  status: string;
}

// 전체 품목 목록 조회
export const getItemsMaster = async (): Promise<ItemMaster[]> => {
  const { data, error } = await fetchClient.GET("/api/master/items" as any, {
    params: { query: {} },
  });

  if (error) {
    throw error;
  }
  return data || [];
};

export const itemsMasterQueryOptions = {
  queryKey: ["master", "items"],
  queryFn: getItemsMaster,
};

export const useGetItemsMasterQuery = () => useQuery(itemsMasterQueryOptions);
