import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface PositionMaster {
  positionCode: string;
  positionName: string;
  level: number;
  category: string;
  baseSalary: number;
  allowance: number;
  description: string;
  employeeCount: number;
  status: string;
  createdDate: string;
}

// 전체 직급 목록 조회
export const getPositionsMaster = async (): Promise<PositionMaster[]> => {
  const { data, error } = await fetchClient.GET(
    "/api/master/positions" as any,
    {
      params: { query: {} },
    },
  );

  if (error) {
    throw error;
  }
  return data || [];
};

export const positionsMasterQueryOptions = {
  queryKey: ["master", "positions"],
  queryFn: getPositionsMaster,
};

export const useGetPositionsMasterQuery = () =>
  useQuery(positionsMasterQueryOptions);
