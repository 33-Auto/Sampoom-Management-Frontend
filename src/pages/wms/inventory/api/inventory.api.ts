import type { InventoryListParams } from "@/pages/wms/inventory/model";
import { queryClient } from "@/shared/api";

// 공통 옵션 생성 함수
const getInventoryQueryOptions = (params?: InventoryListParams) => ({
  params: {
    query: {
      warehouseId: params?.warehouseId ?? 168,
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      keyword: params?.keyword,
      categoryId: params?.categoryId,
      groupId: params?.groupId,
      quantityStatus: params?.quantityStatus,
    },
  },
});

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const inventoryListQueryOptions = (params?: InventoryListParams) =>
  queryClient.queryOptions(
    "get",
    "/api/warehouse/",
    getInventoryQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useWarehouseInventoryQuery = (params?: InventoryListParams) =>
  queryClient.useQuery(
    "get",
    "/api/warehouse/",
    getInventoryQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
    },
  );
