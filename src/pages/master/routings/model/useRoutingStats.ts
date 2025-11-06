import { useMemo } from "react";

import type { ProcessResponseDTO } from "./routings.model";
import { ROUTING_STATUS } from "./routings.model";

export const useRoutingStats = (data: ProcessResponseDTO[]) => {
  return useMemo(() => {
    const totalRoutings = data.length;
    const activeRoutings = data.filter(
      (item) => item.status === ROUTING_STATUS.ACTIVE,
    ).length;
    const avgLeadTime = Math.round(
      data.reduce((sum, item) => sum + (item.totalStepMinutes || 0), 0) /
        totalRoutings || 0,
    );
    const avgOperations = Math.round(
      data.reduce((sum, item) => sum + (item.stepCount || 0), 0) /
        totalRoutings || 0,
    );

    return {
      totalRoutings,
      activeRoutings,
      avgLeadTime,
      avgOperations,
    };
  }, [data]);
};
