import { useMemo } from "react";

interface PartnerData {
  status: string;
  partnerType: string;
}

export const usePartnerStats = (data: PartnerData[]) => {
  return useMemo(() => {
    const totalPartners = data.length;
    const activePartners = data.filter(
      (partner) => partner.status === "활성",
    ).length;
    const customers = data.filter(
      (partner) => partner.partnerType === "고객사",
    ).length;
    const suppliers = data.filter(
      (partner) => partner.partnerType === "공급업체",
    ).length;

    return {
      totalPartners,
      activePartners,
      customers,
      suppliers,
    };
  }, [data]);
};
