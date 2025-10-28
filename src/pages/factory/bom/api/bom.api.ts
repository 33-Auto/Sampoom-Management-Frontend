import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface BOMMaterial {
  code: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface FactoryBOM {
  id: string;
  productName: string;
  version: string;
  status: string;
  createdDate: string;
  lastModified: string;
  materials: BOMMaterial[];
}

// 전체 BOM 목록 조회
export const getFactoryBOMs = async (): Promise<FactoryBOM[]> => {
  const { data, error } = await fetchClient.GET("/api/factory/bom" as any, {
    params: { query: {} },
  });

  if (error) {
    throw error;
  }
  return data || [];
};

export const factoryBOMsQueryOptions = {
  queryKey: ["factory", "bom"],
  queryFn: getFactoryBOMs,
};

export const useGetFactoryBOMsQuery = () => useQuery(factoryBOMsQueryOptions);
