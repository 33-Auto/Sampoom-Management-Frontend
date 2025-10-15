import { tanstackQueryClient } from "@/shared/api";import { routingsListQueryOptions } from "./routings.api";export function routingsLoader() {
  tanstackQueryClient.prefetchQuery(routingsListQueryOptions({}));
  return null;
}
