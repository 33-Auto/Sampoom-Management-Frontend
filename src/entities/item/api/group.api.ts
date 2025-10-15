import { queryClient } from "@/shared/api";export const useMaterialGroupQuery = (categoryId: number) =>
  queryClient.useQuery(
    "get",
    "/api/part/parts/categories/{categoryId}/groups",
    {
      params: {
        path: {
          categoryId: categoryId,
        },
      },
    },
  );
