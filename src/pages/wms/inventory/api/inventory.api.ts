import type { InventoryListParams } from "@/pages/wms/inventory/model";
import { queryClient } from "@/shared/api";

type InventoryListQueryParams = Partial<InventoryListParams> & {
  warehouseId?: number;
};

// 공통 옵션 생성 함수
const getInventoryQueryOptions = (params?: InventoryListQueryParams) => {
  const query: InventoryListParams = {
    warehouseId: params?.warehouseId ?? 0,
    page: params?.page ?? 0,
    size: params?.size ?? 10,
    keyword: params?.keyword,
    categoryId: params?.categoryId,
    groupId: params?.groupId,
    quantityStatus: params?.quantityStatus,
  };

  if (typeof params?.warehouseId === "number") {
    query.warehouseId = params.warehouseId;
  }

  return {
    params: {
      query,
    },
  };
};

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const inventoryListQueryOptions = (params?: InventoryListQueryParams) =>
  queryClient.queryOptions(
    "get",
    "/api/warehouse/",
    getInventoryQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useWarehouseInventoryQuery = (params?: InventoryListQueryParams) =>
  queryClient.useQuery(
    "get",
    "/api/warehouse/",
    getInventoryQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
      enabled: typeof params?.warehouseId === "number",
    },
  );

export type { InventoryListQueryParams };
