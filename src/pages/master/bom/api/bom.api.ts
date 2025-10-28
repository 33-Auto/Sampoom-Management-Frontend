import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface BOMMaterial {
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface BOMMaster {
  bomId: string;
  bomName: string;
  category: string;
  version: string;
  status: string;
  description: string;
  createdDate: string;
  lastModified: string;
  complexity: string;
  componentCount: number;
  totalCost: number;
  materials: BOMMaterial[];
}

// 전체 BOM 목록 조회
export const getBOMMaster = async (): Promise<BOMMaster[]> => {
  const { data, error } = await fetchClient.GET("/api/master/bom" as any, {
    params: { query: {} },
  });

  if (error) {
    throw error;
  }
  return data || [];
};

export const bomMasterQueryOptions = {
  queryKey: ["master", "bom"],
  queryFn: getBOMMaster,
};

export const useGetBOMMasterQuery = () => useQuery(bomMasterQueryOptions);
