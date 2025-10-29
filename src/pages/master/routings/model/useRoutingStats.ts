import { useMemo } from "react";

interface RoutingData {
  status: string;
  totalLeadTime: number;
  operationCount: number;
}

export const useRoutingStats = (data: RoutingData[]) => {
  return useMemo(() => {
    const totalRoutings = data.length;
    const activeRoutings = data.filter((item) => item.status === "활성").length;
    const avgLeadTime = Math.round(
      data.reduce((sum, item) => sum + item.totalLeadTime, 0) / totalRoutings,
    );
    const avgOperations = Math.round(
      data.reduce((sum, item) => sum + item.operationCount, 0) / totalRoutings,
    );

    return {
      totalRoutings,
      activeRoutings,
      avgLeadTime,
      avgOperations,
    };
  }, [data]);
};
