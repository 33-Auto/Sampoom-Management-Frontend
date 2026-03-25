import { api } from "@/shared/api";

export const materialDetailQueryOptions = (materialId: number) =>
  api.queryOptions("get", "/api/part/materials/{materialId}", {
    params: {
      path: {
        materialId,
      },
    },
  });

export const partDetailQueryOptions = (partId: number) =>
  api.queryOptions("get", "/api/part/parts/{partId}", {
    params: {
      path: {
        partId,
      },
    },
  });
export const useCreateMaterialMutation = () =>
  api.useMutation("post", "/api/part/materials");

export const useCreatePartMutation = () =>
  api.useMutation("post", "/api/part/parts");

export const useUpdateMaterialMutation = () =>
  api.useMutation("put", "/api/part/materials/{materialId}");

export const useUpdatePartMutation = () =>
  api.useMutation("put", "/api/part/parts/{partId}");
