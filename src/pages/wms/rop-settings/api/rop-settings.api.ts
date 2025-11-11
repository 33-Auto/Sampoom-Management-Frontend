import type { RopSettingsListParams } from "@/pages/wms/rop-settings/model";
import { queryClient } from "@/shared/api";

type RopSettingsListQueryParams = Partial<RopSettingsListParams> & {
  warehouseId?: number;
};

// 공통 옵션 생성 함수
const getRopSettingsQueryOptions = (params?: RopSettingsListQueryParams) => {
  const query: RopSettingsListParams = {
    warehouseId: params?.warehouseId ?? 0,
    page: params?.page ?? 0,
    size: params?.size ?? 10,
    keyword: params?.keyword,
    categoryId: params?.categoryId,
    groupId: params?.groupId,
    autoOrderStatus: params?.autoOrderStatus,
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
export const ropSettingsQueryOptions = (params?: RopSettingsListQueryParams) =>
  queryClient.queryOptions(
    "get",
    "/api/warehouse/rop",
    getRopSettingsQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useRopSettingsQuery = (params?: RopSettingsListQueryParams) =>
  queryClient.useQuery(
    "get",
    "/api/warehouse/rop",
    getRopSettingsQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
      enabled: typeof params?.warehouseId === "number",
    },
  );

export type { RopSettingsListQueryParams };
