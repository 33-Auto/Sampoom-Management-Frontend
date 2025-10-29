import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type { WorkCenterMaster } from "./workcenters.api";

export interface CreateWorkCenterRequest
  extends Omit<WorkCenterMaster, "workCenterCode"> {}

export interface UpdateWorkCenterRequest extends Partial<WorkCenterMaster> {}

export const createWorkCenter = async (
  workCenterData: CreateWorkCenterRequest,
): Promise<WorkCenterMaster> => {
  const { data, error } = await fetchClient.POST(
    "/api/master/workcenters" as any,
    {
      body: workCenterData,
    },
  );
  if (error) throw error;
  return data as WorkCenterMaster;
};

export const updateWorkCenter = async (
  workCenterCode: string,
  updates: UpdateWorkCenterRequest,
): Promise<WorkCenterMaster> => {
  const { data, error } = await fetchClient.PUT(
    "/api/master/workcenters/{workCenterCode}" as any,
    {
      params: { path: { workCenterCode } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as WorkCenterMaster;
};

export const useCreateWorkCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "workcenters"] });
    },
  });
};

export const useUpdateWorkCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workCenterCode,
      updates,
    }: {
      workCenterCode: string;
      updates: UpdateWorkCenterRequest;
    }) => updateWorkCenter(workCenterCode, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "workcenters"] });
    },
  });
};
