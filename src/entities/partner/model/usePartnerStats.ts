import { useMemo } from "react";

import type { PartnerResponseDTO } from "./partners.model";

export const usePartnerStats = (data: PartnerResponseDTO[]) => {
  return useMemo(() => {
    const totalPartners = data.length;
    const activePartners = data.filter(
      (partner) => partner.status === "ACTIVE",
    ).length;
    // Note: VendorListResponseDTO에는 partnerType이 없으므로 customers/suppliers는 제거
    // 필요시 API 응답에 따라 추가 가능

    return {
      totalPartners,
      activePartners,
    };
  }, [data]);
};
