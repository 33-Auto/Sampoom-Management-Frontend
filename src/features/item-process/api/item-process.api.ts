import { queryClient } from "@/shared/api/base";

export const meterialDetailQueryOptions = (materialId: number) =>
  queryClient.queryOptions("get", "/api/part/materials/{materialId}", {
    params: {
      path: {
        materialId,
      },
    },
  });

export const partDetailQueryOptions = (partId: number) =>
  queryClient.queryOptions("get", "/api/part/parts/{partId}", {
    params: {
      path: {
        partId,
      },
    },
  });
export const useCreateMaterialMutation = () =>
  queryClient.useMutation("post", "/api/part/materials");

export const useCreatePartMutation = () =>
  queryClient.useMutation("post", "/api/part/parts");

export const useUpdateMaterialMutation = () =>
  queryClient.useMutation("put", "/api/part/materials/{materialId}");

export const useUpdatePartMutation = () =>
  queryClient.useMutation("put", "/api/part/parts/{partId}");
