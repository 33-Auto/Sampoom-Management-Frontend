import { tanstackQueryClient } from "@/shared/api";import { partnersListQueryOptions } from "./partners.api";export function partnersLoader() {
  tanstackQueryClient.prefetchQuery(partnersListQueryOptions({}));
  return null;
}
