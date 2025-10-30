import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

// 실제 API 응답 타입
export interface ApiItemResponse {
  id: number;
  type: string; // "부품" | "원자재"
  code: string; // itemCode
  name: string; // itemName
  categoryId: number;
  categoryName: string; // category
  groupId: number;
  groupName: string;
  unit: string | null;
  status: string; // "ACTIVE" | ...
  leadTime?: number | null;
  baseQuantity?: number | null;
}

export interface ApiItemsResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    content: ApiItemResponse[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

// 화면에서 사용하는 타입
export interface ItemMaster {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  categoryId?: number | null;
  itemType: string; // "원자재" | "부품"
  procurementType: string; // "구매" | "생산"
  purchaseLeadTime: number | null;
  productionLeadTime: number | null;
  calculatedProductionLeadTime: number | null;
  unit: string;
  standardPrice: number;
  currentStock: number;
  status: string;
  baseQuantity: number;
  groupId?: number | null;
  groupName?: string | null;
}

// API 응답을 화면 타입으로 변환
const mapApiResponseToItemMaster = (apiItem: ApiItemResponse): ItemMaster => {
  const itemType = apiItem.type === "부품" ? "부품" : "원자재";
  const procurementType = itemType === "원자재" ? "구매" : "생산";

  // 카테고리 경로: 카테고리 > 그룹 (품목명 제외)
  const categoryPath = [apiItem.categoryName, apiItem.groupName]
    .filter(Boolean)
    .join(" > ");

  return {
    id: apiItem.id,
    itemCode: apiItem.code,
    itemName: apiItem.name,
    category: categoryPath,
    categoryId: apiItem.categoryId,
    itemType,
    procurementType,
    // API가 단일 leadTime을 주므로 UI 표시를 위해 양쪽에 동일 반영
    purchaseLeadTime: apiItem.leadTime ?? null,
    productionLeadTime: apiItem.leadTime ?? null,
    calculatedProductionLeadTime: null,
    unit: apiItem.unit || "",
    standardPrice: 0,
    currentStock: 0,
    status: apiItem.status === "ACTIVE" ? "활성" : "비활성",
    baseQuantity: apiItem.baseQuantity ?? 1,
    groupId: apiItem.groupId ?? null,
    groupName: apiItem.groupName ?? null,
  };
};

// 페이지네이션: 지정한 페이지의 데이터만 조회
export const getItemsMaster = async (params?: {
  type?: "ALL" | "원자재" | "부품";
  keyword?: string;
  page?: number;
  size?: number;
  partCategoryId?: number;
  partGroupId?: number;
  materialCategoryId?: number;
}): Promise<{
  items: ItemMaster[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}> => {
  const type = params?.type || "ALL";
  // API 요구사항: 원자재 -> MATERIAL, 부품 -> PART, 그 외(전체) -> ALL
  const apiType =
    type === "원자재" ? "MATERIAL" : type === "부품" ? "PART" : "ALL";
  const keyword = params?.keyword || undefined;
  const page = params?.page ?? 0;
  const size = params?.size ?? 10;

  const { data, error } = await fetchClient.GET(
    "/api/part/api/items/search" as any,
    {
      params: {
        query: {
          type: apiType,
          ...(keyword ? { keyword } : {}),
          ...(params?.partCategoryId !== undefined &&
          params?.partCategoryId !== null
            ? { partCategoryId: params.partCategoryId }
            : {}),
          ...(params?.partGroupId !== undefined && params?.partGroupId !== null
            ? { partGroupId: params.partGroupId }
            : {}),
          ...(params?.materialCategoryId !== undefined &&
          params?.materialCategoryId !== null
            ? { materialCategoryId: params.materialCategoryId }
            : {}),
          page,
          size,
        },
      },
    },
  );

  if (error) {
    throw error;
  }

  const apiResponse = data as ApiItemsResponse;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "데이터 조회 실패");
  }

  return {
    items: apiResponse.data.content.map(mapApiResponseToItemMaster),
    totalPages: apiResponse.data.totalPages,
    totalElements: apiResponse.data.totalElements,
    currentPage: apiResponse.data.currentPage,
    pageSize: apiResponse.data.pageSize,
  };
};

export const itemsMasterQueryOptions = (params?: {
  type?: "ALL" | "원자재" | "부품";
  keyword?: string;
  page?: number;
  size?: number;
  partCategoryId?: number;
  partGroupId?: number;
  materialCategoryId?: number;
}) => ({
  queryKey: ["master", "items", params],
  queryFn: async () => getItemsMaster(params),
  placeholderData: (prev: any) => prev, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
  staleTime: 30_000,
});

export const useGetItemsMasterQuery = (params?: {
  type?: "ALL" | "원자재" | "부품";
  keyword?: string;
  page?: number;
  size?: number;
  partCategoryId?: number;
  partGroupId?: number;
  materialCategoryId?: number;
}) => useQuery(itemsMasterQueryOptions(params));
