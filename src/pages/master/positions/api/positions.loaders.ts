import { queryClient } from "@/shared/api";

import { positionsMasterQueryOptions } from "./positions.api";

export function loader() {
  const positionsPromise = queryClient.ensureQueryData(
    positionsMasterQueryOptions,
  );
  return { positions: positionsPromise };
}
