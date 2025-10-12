import { useMutation } from "@tanstack/react-query";import { fetchClient, tanstackQueryClient } from "@/shared/api";import type { PositionMaster } from "./positions.api";export interface CreatePositionRequest
  extends Omit<PositionMaster, "positionCode"> {}

export interface UpdatePositionRequest extends Partial<PositionMaster> {}

// 직급 등록
export const createPosition = async (
  positionData: CreatePositionRequest,
): Promise<PositionMaster> => {
  const { data, error } = await fetchClient.POST(
    "/api/master/positions" as any,
    {
      body: positionData,
    },
  );
  if (error) throw error;
  return data as PositionMaster;
};

// 직급 수정
export const updatePosition = async (
  positionCode: string,
  updates: UpdatePositionRequest,
): Promise<PositionMaster> => {
  const { data, error } = await fetchClient.PUT(
    "/api/master/positions/{positionCode}" as any,
    {
      params: { path: { positionCode } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as PositionMaster;
};

// React Query Hooks for Mutations

export const useCreatePosition = () => {
  return useMutation({
    mutationFn: createPosition,
    onSuccess: () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ["master", "positions"] });
    },
  });
};

export const useUpdatePosition = () => {
  return useMutation({
    mutationFn: async ({
      positionCode,
      updates,
    }: {
      positionCode: string;
      updates: UpdatePositionRequest;
    }) => updatePosition(positionCode, updates),
    onSuccess: () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ["master", "positions"] });
    },
  });
};
