import { queryClient } from "@/shared/api/query";

import { bomsListQueryOptions } from "./bom.api";

export function bomsLoader() {
  queryClient.prefetchQuery(bomsListQueryOptions({}));
  return null;
}
