import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type { PartnerMaster } from "./partners.api";

export interface CreatePartnerRequest
  extends Omit<PartnerMaster, "partnerCode"> {}

export interface UpdatePartnerRequest extends Partial<PartnerMaster> {}

// 거래처 등록
export const createPartner = async (
  partnerData: CreatePartnerRequest,
): Promise<PartnerMaster> => {
  const { data, error } = await fetchClient.POST(
    "/api/master/partners" as any,
    {
      body: partnerData,
    },
  );
  if (error) throw error;
  return data as PartnerMaster;
};

// 거래처 수정
export const updatePartner = async (
  partnerCode: string,
  updates: UpdatePartnerRequest,
): Promise<PartnerMaster> => {
  const { data, error } = await fetchClient.PUT(
    "/api/master/partners/{partnerCode}" as any,
    {
      params: { path: { partnerCode } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as PartnerMaster;
};

// React Query Hooks for Mutations

export const useCreatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPartner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "partners"] });
    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      partnerCode,
      updates,
    }: {
      partnerCode: string;
      updates: UpdatePartnerRequest;
    }) => updatePartner(partnerCode, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "partners"] });
    },
  });
};
