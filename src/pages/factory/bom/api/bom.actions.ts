import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type { FactoryBOM } from "./bom.api";

export interface CreateBOMRequest extends Omit<FactoryBOM, "id"> {}

export interface UpdateBOMRequest extends Partial<FactoryBOM> {}

// BOM 등록
export const createFactoryBOM = async (
  bomData: CreateBOMRequest,
): Promise<FactoryBOM> => {
  const { data, error } = await fetchClient.POST("/api/factory/bom" as any, {
    body: bomData,
  });
  if (error) throw error;
  return data as FactoryBOM;
};

// BOM 수정
export const updateFactoryBOM = async (
  bomId: string,
  updates: UpdateBOMRequest,
): Promise<FactoryBOM> => {
  const { data, error } = await fetchClient.PUT(
    "/api/factory/bom/{bomId}" as any,
    {
      params: { path: { bomId } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as FactoryBOM;
};

// React Query Hooks for Mutations

export const useCreateFactoryBOM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFactoryBOM,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factory", "bom"] });
    },
  });
};

export const useUpdateFactoryBOM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bomId,
      updates,
    }: {
      bomId: string;
      updates: UpdateBOMRequest;
    }) => updateFactoryBOM(bomId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factory", "bom"] });
    },
  });
};
