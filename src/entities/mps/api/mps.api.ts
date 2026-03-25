import { useQuery } from "@tanstack/react-query";

import { api, queryClient } from "@/shared/api";
import type { paths } from "@/shared/model";

type GetMpsPartInfosOperation =
  paths["/api/factory/{factoryId}/mps/parts"]["get"];
type GetPartForecastMonthsOperation =
  paths["/api/factory/{factoryId}/mps/parts/{partId}/forecast-months"]["get"];
type GetMpsOperation = paths["/api/factory/{factoryId}/mps"]["get"];

type RawMpsPartInfosResponse =
  GetMpsPartInfosOperation["responses"][200]["content"]["*/*"];
type RawPartForecastMonthsResponse =
  GetPartForecastMonthsOperation["responses"][200]["content"]["*/*"];
type RawMpsResponse = GetMpsOperation["responses"][200]["content"]["*/*"];
type ExecuteMpsOperation =
  paths["/api/factory/{factoryId}/mps/{mpsId}/execute"]["post"];
type ConfirmMpsOperation =
  paths["/api/factory/{factoryId}/mps/{mpsId}/confirm"]["post"];
type RawMpsPlanResponse =
  ExecuteMpsOperation["responses"][200]["content"]["*/*"];
type RawPartOrderListResponse =
  ConfirmMpsOperation["responses"][200]["content"]["*/*"];

export type MpsPartInfoResponse = RawMpsPartInfosResponse | undefined;
export type MpsPartInfo = MpsPartInfoResponse extends { data?: infer T }
  ? T extends Array<infer U>
    ? U
    : never
  : never;

export type PartForecastMonthsResponse =
  | RawPartForecastMonthsResponse
  | undefined;

export type MpsResponse = RawMpsResponse | undefined;

type ExtractMpsDetail<T> = T extends { data?: infer D } ? D : never;
export type MpsDetail = ExtractMpsDetail<NonNullable<RawMpsResponse>>;
type RawMpsPlanData = ExtractMpsDetail<NonNullable<RawMpsPlanResponse>>;
type RawPartOrderData = ExtractMpsDetail<NonNullable<RawPartOrderListResponse>>;

export type MpsPlanResult =
  RawMpsPlanData extends Array<infer U> ? U : RawMpsPlanData;
export type PartOrderResult =
  RawPartOrderData extends Array<infer U> ? U : RawPartOrderData;

export interface MpsQueryParams {
  factoryId: number;
  partId: number;
  forecastMonth: string;
  warehouseId: number;
}

const getMpsPartsQueryOptions = (factoryId?: number) => ({
  params: {
    path: {
      factoryId: factoryId ?? Number.NaN,
    },
  },
});

export const useMpsPartsQuery = (factoryId?: number) =>
  useQuery(
    api.queryOptions(
      "get",
      "/api/factory/{factoryId}/mps/parts",
      getMpsPartsQueryOptions(factoryId),
    ) as any,
  );

const getPartForecastMonthsQueryOptions = (
  factoryId?: number,
  partId?: number,
) => ({
  params: {
    path: {
      factoryId: factoryId ?? Number.NaN,
      partId: partId ?? Number.NaN,
    },
  },
});

export const usePartForecastMonthsQuery = (
  factoryId?: number,
  partId?: number,
) =>
  useQuery(
    api.queryOptions(
      "get",
      "/api/factory/{factoryId}/mps/parts/{partId}/forecast-months",
      getPartForecastMonthsQueryOptions(factoryId, partId),
    ) as any,
  );

const getMpsQueryParams = (params: MpsQueryParams) => ({
  params: {
    path: {
      factoryId: params.factoryId,
    },
    query: {
      partId: params.partId,
      forecastMonth: params.forecastMonth,
      warehouseId: params.warehouseId,
    },
  },
});

const getMpsQueryOptions = (params: MpsQueryParams) =>
  (api as any).queryOptions(
    "get",
    "/api/factory/{factoryId}/mps",
    getMpsQueryParams(params),
  );

export const fetchMpsByWarehouse = async (
  params: MpsQueryParams,
): Promise<RawMpsResponse | null> => {
  const { queryKey, queryFn, ...restOptions } = getMpsQueryOptions(params);

  try {
    const response = await queryClient.fetchQuery({
      queryKey,
      queryFn,
      // 강제로 재요청하도록 기본 staleTime을 0으로 설정
      staleTime: 0,
      ...restOptions,
    });
    return response ?? null;
  } catch (error) {
    const status = (error as any)?.status ?? (error as any)?.response?.status;
    if (status === 404) {
      return null;
    }

    throw error;
  }
};

export const useExecuteMpsMutation = () =>
  api.useMutation("post", "/api/factory/{factoryId}/mps/{mpsId}/execute");

export const useConfirmMpsMutation = () =>
  api.useMutation("post", "/api/factory/{factoryId}/mps/{mpsId}/confirm");
