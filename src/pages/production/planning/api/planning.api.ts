import type { ProductionPlanListParams } from "@/pages/production/planning/model";
import {
  DEFAULT_FACTORY_ID,
  DEFAULT_INCLUDE_RECENT_DAYS,
} from "@/pages/production/planning/model";
import { queryClient } from "@/shared/api";

export type ProductionPlansQueryParams = ProductionPlanListParams & {
  factoryId?: number;
  includeRecentDays?: number;
};

export const useBatchMrpExecutionMutation = () =>
  queryClient.useMutation(
    "post",
    "/api/factory/{factoryId}/part/orders/mrp/batch",
  );

export const useBatchMrpApplyMutation = () =>
  queryClient.useMutation(
    "post",
    "/api/factory/{factoryId}/part/orders/apply-mrp/batch",
  );

const buildQuery = (params?: ProductionPlansQueryParams) => {
  const query: Record<string, unknown> = {
    page: params?.page ?? 0,
    size: params?.size ?? 10,
    includeRecentDays: params?.includeRecentDays ?? DEFAULT_INCLUDE_RECENT_DAYS,
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
  if (params?.statuses && params.statuses.length > 0) {
    query.statuses = params.statuses;
  }

  return query;
};

const getProductionPlansQueryOptions = (
  params?: ProductionPlansQueryParams,
) => ({
  params: {
    path: {
      factoryId: params?.factoryId ?? DEFAULT_FACTORY_ID,
    },
    query: buildQuery(params),
  },
});

export const productionPlansListQueryOptions = (
  params?: ProductionPlansQueryParams,
) =>
  queryClient.queryOptions(
    "get",
    "/api/factory/{factoryId}/part/orders/production-plans",
    getProductionPlansQueryOptions(params),
  );

export const useProductionPlansQuery = (params?: ProductionPlansQueryParams) =>
  queryClient.useQuery(
    "get",
    "/api/factory/{factoryId}/part/orders/production-plans",
    getProductionPlansQueryOptions(params),
    {
      placeholderData: (previousData) => previousData,
    },
  );
