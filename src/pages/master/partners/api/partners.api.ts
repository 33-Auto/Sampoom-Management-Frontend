import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface PartnerMaster {
  partnerCode: string;
  partnerName: string;
  partnerType: string;
  businessNumber: string;
  representative: string;
  contact: string;
  phone: string;
  address: string;
  paymentTerms: string;
  creditLimit: number;
  status: string;
  registrationDate: string;
}

// 전체 거래처 목록 조회
export const getPartnersMaster = async (): Promise<PartnerMaster[]> => {
  const { data, error } = await fetchClient.GET("/api/master/partners" as any, {
    params: { query: {} },
  });

  if (error) {
    throw error;
  }
  return data || [];
};

export const partnersMasterQueryOptions = {
  queryKey: ["master", "partners"],
  queryFn: getPartnersMaster,
};

export const useGetPartnersMasterQuery = () =>
  useQuery(partnersMasterQueryOptions);
