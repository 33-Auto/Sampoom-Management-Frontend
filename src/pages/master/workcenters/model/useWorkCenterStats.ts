import { useMemo } from "react";

interface WorkCenterData {
  status: string;
  type: string;
  dailyCapacity: number;
  efficiency: number;
  hourlyRate: number;
}

export const useWorkCenterStats = (data: WorkCenterData[]) => {
  return useMemo(() => {
    const totalWorkCenters = data.length;
    const activeWorkCenters = data.filter(
      (item) => item.status === "가동",
    ).length;
    const internalWorkCenters = data.filter(
      (item) => item.type === "내부 설비",
    ).length;
    const externalWorkCenters = data.filter(
      (item) => item.type === "외주 가공처",
    ).length;
    const totalCapacity = data
      .filter((item) => item.status === "가동")
      .reduce(
        (sum, item) => sum + (item.dailyCapacity * item.efficiency) / 100,
        0,
      );
    const avgHourlyRate = Math.round(
      data.reduce((sum, item) => sum + item.hourlyRate, 0) / totalWorkCenters,
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
