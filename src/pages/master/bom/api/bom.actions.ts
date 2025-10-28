import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type { BOMMaster } from "./bom.api";

export interface CreateBOMRequest extends Omit<BOMMaster, "bomId"> {}

export interface UpdateBOMRequest extends Partial<BOMMaster> {}

// BOM 등록
export const createBOM = async (
  bomData: CreateBOMRequest,
): Promise<BOMMaster> => {
  const { data, error } = await fetchClient.POST("/api/master/bom" as any, {
    body: bomData,
  });
  if (error) throw error;
  return data as BOMMaster;
};

// BOM 수정
export const updateBOM = async (
  bomId: string,
  updates: UpdateBOMRequest,
): Promise<BOMMaster> => {
  const { data, error } = await fetchClient.PUT(
    "/api/master/bom/{bomId}" as any,
    {
      params: { path: { bomId } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as BOMMaster;
};

// React Query Hooks for Mutations

export const useCreateBOM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBOM,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "bom"] });
    },
  });
};

export const useUpdateBOM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bomId,
      updates,
    }: {
      bomId: string;
      updates: UpdateBOMRequest;
    }) => updateBOM(bomId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "bom"] });
    },
  });
};
