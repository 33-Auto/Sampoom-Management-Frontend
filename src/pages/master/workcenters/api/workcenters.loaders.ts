import { tanstackQueryClient } from "@/shared/api";import { workCentersListQueryOptions } from "./workcenters.api";export function workCentersLoader() {
  tanstackQueryClient.prefetchQuery(workCentersListQueryOptions({}));
  return null;
}
