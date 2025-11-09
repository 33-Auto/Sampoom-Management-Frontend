import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import {
  materialDetailQueryOptions,
  partDetailQueryOptions,
} from "./item-process.api";

// 두개의 id값을 나누어서 처리하는 로더
export const itemProcessLoader = (materialId?: number, partId?: number) => {
  if (materialId) {
    tanstackQueryClient.prefetchQuery(materialDetailQueryOptions(materialId));
  } else if (partId) {
    tanstackQueryClient.prefetchQuery(partDetailQueryOptions(partId));
  }

  return null;
};
