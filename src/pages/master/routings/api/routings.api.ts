import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface RoutingOperation {
  operationNumber: number;
  operationName: string;
  workCenterCode: string;
  setupTime: number;
  processTime: number;
  waitTime: number;
}

export interface RoutingMaster {
  routingCode: string;
  itemCode: string;
  itemName: string;
  version: string;
  status: string;
  totalLeadTime: number;
  operationCount: number;
  operations: RoutingOperation[];
}

export const getRoutingsMaster = async (): Promise<RoutingMaster[]> => {
  const { data, error } = await fetchClient.GET("/api/master/routings" as any, {
    params: { query: {} },
  });

  if (error) {
    throw error;
  }
  return data || [];
};

export const routingsMasterQueryOptions = {
  queryKey: ["master", "routings"],
  queryFn: getRoutingsMaster,
};

export const useGetRoutingsMasterQuery = () =>
  useQuery(routingsMasterQueryOptions);
