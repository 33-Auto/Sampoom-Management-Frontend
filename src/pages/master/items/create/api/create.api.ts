import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

// Materials Categories
export interface MaterialCategory {
  id: number;
  name: string;
  code: string;
}

interface ApiListResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export const getMaterialCategories = async (): Promise<MaterialCategory[]> => {
  const { data, error } = await fetchClient.GET(
    "/api/part/api/materials/category" as any,
    {},
  );
  if (error) throw error;
  const res = data as ApiListResponse<MaterialCategory[]>;
  if (!res.success) throw new Error(res.message || "카테고리 조회 실패");
  return res.data;
};

export const useMaterialCategoriesQuery = () =>
  useQuery({
    queryKey: ["items", "materials", "categories"],
    queryFn: getMaterialCategories,
    staleTime: 60_000,
  });

// Parts Categories
export interface PartCategory {
  categoryId: number;
  categoryName: string;
  name: string;
}

export const getPartCategories = async (): Promise<PartCategory[]> => {
  const { data, error } = await fetchClient.GET(
    "/api/part/api/parts/categories" as any,
    {},
  );
  if (error) throw error;
  const res = data as ApiListResponse<PartCategory[]>;
  if (!res.success) throw new Error(res.message || "카테고리 조회 실패");
  return res.data;
};

export const usePartCategoriesQuery = () =>
  useQuery({
    queryKey: ["items", "parts", "categories"],
    queryFn: getPartCategories,
    staleTime: 60_000,
  });

// Part Groups by Category
export interface PartGroup {
  groupId: number;
  groupName: string;
  categoryId: number;
  categoryName: string;
}

export const getPartGroups = async (
  categoryId: number,
): Promise<PartGroup[]> => {
  const { data, error } = await fetchClient.GET(
    "/api/part/api/parts/categories/{categoryId}/groups" as any,
    { params: { path: { categoryId } } as any },
  );
  if (error) throw error;
  const res = data as ApiListResponse<PartGroup[]>;
  if (!res.success) throw new Error(res.message || "그룹 조회 실패");
  return res.data;
};

export const usePartGroupsQuery = (categoryId?: number) =>
  useQuery({
    queryKey: ["items", "parts", "groups", categoryId],
    queryFn: async () => getPartGroups(categoryId as number),
    enabled: !!categoryId,
  });

// Create Material
export interface CreateMaterialRequest {
  name: string;
  materialCategoryId: number;
  materialUnit: string;
  baseQuantity: number;
  leadTime: number;
}

export const createMaterial = async (
  payload: CreateMaterialRequest,
): Promise<void> => {
  const { error } = await fetchClient.POST("/api/part/api/materials" as any, {
    body: payload as any,
  });
  if (error) throw error;
};

export const useCreateMaterialMutation = () =>
  useMutation({ mutationFn: createMaterial });

// Create Part
export interface CreatePartRequest {
  name: string;
  groupId: number;
  partUnit: string;
  baseQuantity: number;
  leadTime: number;
}

export const createPart = async (payload: CreatePartRequest): Promise<void> => {
  const { error } = await fetchClient.POST("/api/part/api/parts" as any, {
    body: payload as any,
  });
  if (error) throw error;
};

export const useCreatePartMutation = () =>
  useMutation({ mutationFn: createPart });

// Detail fetchers
export interface PartDetailResponse {
  id: number;
  name: string;
  status: string;
  partUnit: string;
  baseQuantity: number;
  leadTime: number;
}

export interface MaterialDetailResponse {
  id: number;
  name: string;
  materialCategoryId: number;
  materialUnit: string;
  baseQuantity: number;
  leadTime: number;
}

export const getPartDetail = async (
  id: number,
): Promise<PartDetailResponse> => {
  const { data, error } = await fetchClient.GET(
    "/api/part/api/parts/{id}" as any,
    { params: { path: { id } } as any },
  );
  if (error) throw error;
  const wrapped = data as { data?: PartDetailResponse } | PartDetailResponse;
  return (wrapped as any).data
    ? (wrapped as { data: PartDetailResponse }).data
    : (wrapped as PartDetailResponse);
};

export const getMaterialDetail = async (
  id: number,
): Promise<MaterialDetailResponse> => {
  const { data, error } = await fetchClient.GET(
    "/api/part/api/materials/{id}" as any,
    { params: { path: { id } } as any },
  );
  if (error) throw error;
  const wrapped = data as
    | { data?: MaterialDetailResponse }
    | MaterialDetailResponse;
  return (wrapped as any).data
    ? (wrapped as { data: MaterialDetailResponse }).data
    : (wrapped as MaterialDetailResponse);
};

export const usePartDetailQuery = (id?: number) =>
  useQuery({
    queryKey: ["items", "parts", "detail", id],
    queryFn: async () => getPartDetail(id as number),
    enabled: !!id,
  });

export const useMaterialDetailQuery = (id?: number) =>
  useQuery({
    queryKey: ["items", "materials", "detail", id],
    queryFn: async () => getMaterialDetail(id as number),
    enabled: !!id,
  });

// Update mutations
export interface UpdatePartRequest {
  name: string;
  status: "ACTIVE" | "INACTIVE" | string;
  partUnit: string;
  baseQuantity: number;
  leadTime: number;
  // extend to allow category/group update when backend supports it
  groupId?: number;
  partCategoryId?: number;
}

export interface UpdateMaterialRequest {
  name: string;
  materialCategoryId: number;
  materialUnit: string;
  baseQuantity: number;
  leadTime: number;
}

export const updatePart = async (
  id: number,
  payload: UpdatePartRequest,
): Promise<void> => {
  const { error } = await fetchClient.PUT("/api/part/api/parts/{id}" as any, {
    params: { path: { id } } as any,
    body: payload as any,
  });
  if (error) throw error;
};

export const updateMaterial = async (
  id: number,
  payload: UpdateMaterialRequest,
): Promise<void> => {
  const { error } = await fetchClient.PUT(
    "/api/part/api/materials/{id}" as any,
    { params: { path: { id } } as any, body: payload as any },
  );
  if (error) throw error;
};

export const useUpdatePartMutation = () =>
  useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdatePartRequest }) =>
      updatePart(id, payload),
  });

export const useUpdateMaterialMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateMaterialRequest;
    }) => updateMaterial(id, payload),
  });

// Delete mutations
export const deleteMaterial = async (id: number): Promise<void> => {
  const { error } = await fetchClient.DELETE(
    "/api/part/api/materials/{id}" as any,
    { params: { path: { id } } as any },
  );
  if (error) throw error;
};

export const deletePart = async (id: number): Promise<void> => {
  const { error } = await fetchClient.DELETE(
    "/api/part/api/parts/{id}" as any,
    { params: { path: { id } } as any },
  );
  if (error) throw error;
};

export const useDeleteMaterialMutation = () =>
  useMutation({ mutationFn: async (id: number) => deleteMaterial(id) });

export const useDeletePartMutation = () =>
  useMutation({ mutationFn: async (id: number) => deletePart(id) });
