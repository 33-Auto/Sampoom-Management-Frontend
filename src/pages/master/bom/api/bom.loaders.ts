import { queryClient } from "@/shared/api";

import { bomsListQueryOptions } from "./bom.api";

export function bomsLoader() {
  queryClient.prefetchQuery(bomsListQueryOptions({}));
  return null;
}
