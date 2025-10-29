import { queryClient } from "@/shared/api/query";

import { workCentersMasterQueryOptions } from "./workcenters.api";

export function loader() {
  const workCentersPromise = queryClient.ensureQueryData(
    workCentersMasterQueryOptions,
  );
  return { workCenters: workCentersPromise };
}
