import { queryClient } from "@/shared/api/query";

import { routingsMasterQueryOptions } from "./routings.api";

export function loader() {
  const routingsPromise = queryClient.ensureQueryData(
    routingsMasterQueryOptions,
  );
  return { routings: routingsPromise };
}
