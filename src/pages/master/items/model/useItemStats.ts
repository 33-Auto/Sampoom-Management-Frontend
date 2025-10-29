import { useMemo } from "react";

interface ItemData {
  status: string;
  procurementType: string;
  purchaseLeadTime?: number | null;
  productionLeadTime?: number | null;
  calculatedProductionLeadTime?: number | null;
  itemCode?: string;
  itemName?: string;
  category?: string;
  itemType?: string;
  unit?: string;
  standardPrice?: number;
  currentStock?: number;
}

export const useItemStats = (data: ItemData[]) => {
  return useMemo(() => {
    const totalItems = data.length;
    const activeItems = data.filter((item) => item.status === "활성").length;
    const purchaseItems = data.filter(
      (item) => item.procurementType === "구매",
    ).length;
    const productionItems = data.filter(
      (item) => item.procurementType === "생산",
    ).length;
    const avgPurchaseLeadTime = Math.round(
      data
        .filter(
          (item) => item.procurementType === "구매" && item.purchaseLeadTime,
        )
        .reduce((sum, item) => sum + (item.purchaseLeadTime || 0), 0) /
        data.filter(
          (item) => item.procurementType === "구매" && item.purchaseLeadTime,
        ).length,
    );
    const avgProductionLeadTime = Math.round(
      data
        .filter(
          (item) => item.procurementType === "생산" && item.productionLeadTime,
        )
        .reduce((sum, item) => sum + (item.productionLeadTime || 0), 0) /
        data.filter(
          (item) => item.procurementType === "생산" && item.productionLeadTime,
        ).length,
    );

    return {
      totalItems,
      activeItems,
      purchaseItems,
      productionItems,
      avgPurchaseLeadTime,
      avgProductionLeadTime,
    };
  }, [data]);
};
