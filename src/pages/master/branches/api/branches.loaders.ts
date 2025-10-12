import { tanstackQueryClient } from "@/shared/api";import { branchesListQueryOptions } from "./branches.api";export function branchesLoader() {
  tanstackQueryClient.prefetchQuery(branchesListQueryOptions({}));
  return null;
}
