import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type {
  ApiPagedResponse,
  ApiSalesOrderItem,
  SalesOrderRow,
  SalesOrdersListResult,
  SalesOrdersQueryParams,
} from "./sales-orders.types";

const formatDate = (iso: string): string => iso.slice(0, 10);

const flattenParts = (
  item: ApiSalesOrderItem,
): {
  firstName: string | null;
  totalCount: number;
  totalParts: number;
  totalAmount: number;
} => {
  const parts: { name: string; quantity: number; standardCost: number }[] = [];
  for (const cat of item.items || []) {
    for (const grp of cat.groups || []) {
      for (const p of grp.parts || []) {
        parts.push({
          name: p.name,
          quantity: p.quantity ?? 0,
          standardCost: p.standardCost ?? 0,
        });
      }
    }
  }
  const totalCount = parts.reduce((sum, p) => sum + (p.quantity ?? 0), 0);
  const totalAmount = parts.reduce(
    (sum, p) => sum + (p.quantity ?? 0) * (p.standardCost ?? 0),
    0,
  );
  const firstName = parts.length > 0 ? parts[0].name : null;
  return { firstName, totalCount, totalParts: parts.length, totalAmount };
};

const mapToRow = (item: ApiSalesOrderItem): SalesOrderRow => {
  const { firstName, totalCount, totalParts, totalAmount } = flattenParts(item);
  const productName = firstName
    ? totalParts > 1
      ? `${firstName} 외 ${totalParts - 1}개`
      : firstName
    : "-";

  return {
    orderId: item.orderId,
    orderNumber: item.orderNumber,
    createdDate: formatDate(item.createdAt),
    agencyName: item.agencyName,
    productName,
    totalQuantity: totalCount,
    totalAmount,
    status: item.status,
  };
};

export const getSalesOrders = async (
  params: SalesOrdersQueryParams,
): Promise<SalesOrdersListResult> => {
  const { warehouseId, page = 0, size = 20, from, status } = params;

  const { data, error } = await fetchClient.GET(
    "/api/order/warehouse/{warehouseId}" as any,
    {
      params: {
        path: { warehouseId },
        query: {
          page,
          size,
          ...(from ? { from } : {}),
          ...(status ? { status } : {}),
        },
      },
    },
  );

  if (error) throw error;

  const apiResponse = data as ApiPagedResponse<ApiSalesOrderItem>;
  if (!apiResponse.success) {
    throw new Error(apiResponse.message || "데이터 조회 실패");
  }

  return {
    orders: apiResponse.data.content.map(mapToRow),
    totalPages: apiResponse.data.totalPages,
    totalElements: apiResponse.data.totalElements,
    currentPage: apiResponse.data.number,
    pageSize: apiResponse.data.size,
    rawContent: apiResponse.data.content,
  };
};

export const salesOrdersQueryOptions = (params: SalesOrdersQueryParams) => ({
  queryKey: ["sales", "orders", params],
  queryFn: async () => getSalesOrders(params),
  placeholderData: (prev: any) => prev,
  staleTime: 30_000,
});

export const useSalesOrdersQuery = (params: SalesOrdersQueryParams) =>
  useQuery(salesOrdersQueryOptions(params));

// Detail fetch
export const getSalesOrderDetail = async (
  id: number,
): Promise<ApiSalesOrderItem> => {
  const { data, error } = await fetchClient.GET("/api/order/{id}" as any, {
    params: { path: { id } },
  });
  if (error) throw error;
  const api = data as ApiPagedResponse<ApiSalesOrderItem> | any;
  // Some endpoints may return wrapped object with data
  if (api?.success && api?.data) return api.data as ApiSalesOrderItem;
  return api as ApiSalesOrderItem;
};

export const useSalesOrderDetailQuery = (id?: number) =>
  useQuery({
    queryKey: ["sales", "orders", "detail", id],
    queryFn: async () => {
      if (!id && id !== 0) throw new Error("id is required");
      return getSalesOrderDetail(id as number);
    },
    enabled: typeof id === "number" && !Number.isNaN(id),
  });

// Mutations: complete and cancel order
export const useCompleteOrderMutation = () =>
  useMutation({
    mutationKey: ["sales", "orders", "complete"],
    mutationFn: async (orderId: number) => {
      const { error } = await fetchClient.PATCH(
        "/api/order/complete/{id}" as any,
        { params: { path: { id: orderId } } },
      );
      if (error) throw error;
    },
  });

export const useCancelOrderMutation = () =>
  useMutation({
    mutationKey: ["sales", "orders", "cancel"],
    mutationFn: async (orderId: number) => {
      const { error } = await fetchClient.PATCH(
        "/api/order/cancel/{id}" as any,
        { params: { path: { id: orderId } } },
      );
      if (error) throw error;
    },
  });
