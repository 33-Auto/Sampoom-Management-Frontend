import { api } from "@/shared/api";

export function usePartSearchQuery(
  partCategoryId: number,
  partGroupId: number,
) {
  return api.useQuery(
    "get",
    "/api/part/parts",
    {
      params: {
        query: {
          groupId: partGroupId,
        },
      },
    },
    // enabled는 init이 아니라 옵션 인자로 넘겨야 적용된다
    { enabled: !!partGroupId },
  );
}
