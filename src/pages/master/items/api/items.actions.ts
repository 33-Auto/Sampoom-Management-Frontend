import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type { ItemMaster } from "./items.api";

export interface CreateItemRequest extends Omit<ItemMaster, "itemCode"> {}

export interface UpdateItemRequest extends Partial<ItemMaster> {}

// 품목 등록
export const createItem = async (
  itemData: CreateItemRequest,
): Promise<ItemMaster> => {
  const { data, error } = await fetchClient.POST("/api/master/items" as any, {
    body: itemData,
  });
  if (error) throw error;
  return data as ItemMaster;
};

// 품목 수정
export const updateItem = async (
  itemCode: string,
  updates: UpdateItemRequest,
): Promise<ItemMaster> => {
  const { data, error } = await fetchClient.PUT(
    "/api/master/items/{itemCode}" as any,
    {
      params: { path: { itemCode } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as ItemMaster;
};

// React Query Hooks for Mutations

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "items"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemCode,
      updates,
    }: {
      itemCode: string;
      updates: UpdateItemRequest;
    }) => updateItem(itemCode, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master", "items"] });
    },
  });
};
