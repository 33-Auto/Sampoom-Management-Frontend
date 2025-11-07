import { queryClient } from "@/shared/api/base";

export const usePartGroupsQuery = (categoryId?: number) =>
  queryClient.useQuery(
    "get",
    "/api/part/parts/categories/{categoryId}/groups",
    {
      params: {
        path: {
          categoryId: categoryId as number,
        },
      },
    },
  );
