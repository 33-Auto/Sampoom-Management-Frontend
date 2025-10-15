import { tanstackQueryClient } from "@/shared/api";import { bomsListQueryOptions } from "./bom.api";export function bomsLoader() {
  tanstackQueryClient.prefetchQuery(bomsListQueryOptions({}));
  return null;
}
