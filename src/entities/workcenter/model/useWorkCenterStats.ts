import { useMemo } from "react";

import type { WorkCenterResponseDTO } from "./workcenters.model";

export const useWorkCenterStats = (data: WorkCenterResponseDTO[]) => {
  return useMemo(() => {
    const totalWorkCenters = data.length;
    const activeWorkCenters = data.filter(
      (item) => item.status === "ACTIVE",
    ).length;
    const internalWorkCenters = data.filter(
      (item) => item.type === "INTERNAL",
    ).length;
    const externalWorkCenters = data.filter(
      (item) => item.type === "EXTERNAL",
    ).length;
    const totalCapacity = data
      .filter((item) => item.status === "ACTIVE")
      .reduce(
        (sum, item) =>
          sum +
          ((item.dailyOperatingHours || 0) * (item.efficiency || 0)) / 100,
        0,
      );
    const avgHourlyRate = Math.round(
      data.length > 0
        ? data.reduce((sum, item) => sum + (item.costPerHour || 0), 0) /
            totalWorkCenters
        : 0,
    );

    return {
      totalWorkCenters,
      activeWorkCenters,
      internalWorkCenters,
      externalWorkCenters,
      totalCapacity,
      avgHourlyRate,
    };
  }, [data]);
};
