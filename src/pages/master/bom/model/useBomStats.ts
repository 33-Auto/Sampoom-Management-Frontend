import React from "react";

interface BomRecord {
  status?: string;
  materials?: Array<{ unitCost?: number }>;
}

export function useBomStats(boms: BomRecord[]) {
  return React.useMemo(() => {
    const totalBoms = boms?.length || 0;

    const activeBoms = boms?.filter((bom) => bom.status === "활성").length || 0;
    const reviewingBoms =
      boms?.filter((bom) => bom.status === "검토중").length || 0;

    const totalCost =
      boms?.reduce((sum, bom) => {
        const bomCost = (bom.materials || []).reduce(
          (innerSum, m) => innerSum + (m.unitCost || 0),
          0,
        );
        return sum + bomCost;
      }, 0) || 0;

    const avgCost = totalBoms > 0 ? totalCost / totalBoms : 0;

    const totalComponents =
      boms?.reduce((sum, bom) => sum + (bom.materials?.length || 0), 0) || 0;
    const avgComponents =
      totalBoms > 0 ? Math.round(totalComponents / totalBoms) : 0;

    const complexBoms =
      boms?.filter((bom) => (bom.materials?.length || 0) >= 16).length || 0;

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
