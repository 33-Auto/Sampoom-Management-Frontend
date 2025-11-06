import { queryClient } from "@/shared/api";
export const useMaterialGroupQuery = (categoryId: number) =>
  queryClient.useQuery(
    "get",
    "/api/part/api/parts/categories/{categoryId}/groups",
    {
      params: {
        path: {
          categoryId: categoryId,
        },
      },
    },
  );
