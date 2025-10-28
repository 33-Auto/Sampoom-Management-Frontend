import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type { RoutingMaster } from "./routings.api";

export interface CreateRoutingRequest
  extends Omit<RoutingMaster, "routingCode"> {}

export interface UpdateRoutingRequest extends Partial<RoutingMaster> {}

export const createRouting = async (
  routingData: CreateRoutingRequest,
): Promise<RoutingMaster> => {
  const { data, error } = await fetchClient.POST(
    "/api/master/routings" as any,
    {
      body: routingData,
    },
  );
  if (error) throw error;
  return data as RoutingMaster;
};

export const updateRouting = async (
  routingCode: string,
  updates: UpdateRoutingRequest,
): Promise<RoutingMaster> => {
  const { data, error } = await fetchClient.PUT(
    "/api/master/routings/{routingCode}" as any,
    {
      params: { path: { routingCode } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as RoutingMaster;
};

export const useCreateRouting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRouting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "routings"] });
    },
  });
};

export const useUpdateRouting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      routingCode,
      updates,
    }: {
      routingCode: string;
      updates: UpdateRoutingRequest;
    }) => updateRouting(routingCode, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "routings"] });
    },
  });
};
