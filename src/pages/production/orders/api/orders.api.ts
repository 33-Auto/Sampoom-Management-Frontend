import { api } from "@/shared/api";

import type { PartOrderListParams } from "../model/orders.model";
import { DEFAULT_PART_ORDER_STATUSES } from "../model/orders.model";

export type PartOrdersQueryParams = PartOrderListParams & {
  factoryId?: number;
};

const buildQuery = (params?: PartOrdersQueryParams) => {
  const query: Record<string, unknown> = {
    page: params?.page ?? 0,
    size: params?.size ?? 10,
  };

  if (params?.query) {
    query.query = params.query;
  }
  if (params?.categoryId !== undefined) {
    query.categoryId = params.categoryId;
  }
  if (params?.groupId !== undefined) {
    query.groupId = params.groupId;
  }
  if (params?.priorities && params.priorities.length > 0) {
    query.priorities = params.priorities;
  }
  const statuses = params?.statuses ?? DEFAULT_PART_ORDER_STATUSES;
  if (statuses.length > 0) {
    query.statuses = statuses;
  }

  return query;
};

const getPartOrdersQueryOptions = (params?: PartOrdersQueryParams) => ({
  params: {
    path: {
      factoryId: params?.factoryId ?? Number.NaN,
    },
    query: buildQuery(params),
  },
});

export const partOrdersListQueryOptions = (params?: PartOrdersQueryParams) =>
  api.queryOptions(
    "get",
    "/api/factory/{factoryId}/part/orders",
    getPartOrdersQueryOptions(params),
  );

export const usePartOrdersQuery = (params?: PartOrdersQueryParams) =>
  api.useQuery(
    "get",
    "/api/factory/{factoryId}/part/orders",
    getPartOrdersQueryOptions(params),
    {
      placeholderData: (previousData: any) => previousData,
      enabled:
        typeof params?.factoryId === "number" &&
        Number.isFinite(params.factoryId),
    },
  );
