import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface WorkCenterMaster {
  workCenterCode: string;
  workCenterName: string;
  type: string;
  dailyCapacity: number;
  efficiency: number;
  hourlyRate: number;
  status: string;
  description: string;
}

// 전체 작업장 목록 조회
export const getWorkCentersMaster = async (): Promise<WorkCenterMaster[]> => {
  const { data, error } = await fetchClient.GET(
    "/api/master/workcenters" as any,
    {
      params: { query: {} },
    },
  );

  if (error) {
    throw error;
  }
  return data || [];
};

export const workCentersMasterQueryOptions = {
  queryKey: ["master", "workcenters"],
  queryFn: getWorkCentersMaster,
};

export const useGetWorkCentersMasterQuery = () =>
  useQuery(workCentersMasterQueryOptions);
