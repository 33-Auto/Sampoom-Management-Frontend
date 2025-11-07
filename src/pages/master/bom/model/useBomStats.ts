import { useMemo } from "react";

import type { BomResponseDTO } from "./bom.model";

export function useBomStats(boms: BomResponseDTO[]) {
  return useMemo(() => {
    const totalBoms = boms?.length || 0;

    const activeBoms =
      boms?.filter((bom) => bom.status === "ACTIVE").length || 0;
    const reviewingBoms =
      boms?.filter((bom) => bom.status === "REVIEWING").length || 0;

    const totalCost =
      boms?.reduce((sum, bom) => sum + (bom.totalCost || 0), 0) || 0;

    const avgCost = totalBoms > 0 ? totalCost / totalBoms : 0;

    const totalComponents =
      boms?.reduce((sum, bom) => sum + (bom.componentCount || 0), 0) || 0;
    const avgComponents =
      totalBoms > 0 ? Math.round(totalComponents / totalBoms) : 0;

    const complexBoms =
      boms?.filter((bom) => bom.complexity === "COMPLEX").length || 0;

    return {
      totalBoms,
      activeBoms,
      reviewingBoms,
      avgCost,
      avgComponents,
      complexBoms,
    };
  }, [boms]);
}
