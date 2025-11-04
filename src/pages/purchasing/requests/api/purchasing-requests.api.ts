import { queryClient } from "@/shared/api";

export const purchaseRequestListQueryOptions = () =>
  queryClient.queryOptions("get", "/api/purchase/", {
    params: {
      query: {
        page: 0,
        size: 10,
      },
    },
  });
