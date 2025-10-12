import { tanstackQueryClient } from "@/shared/api";import { positionsMasterQueryOptions } from "./positions.api";export function loader() {
  const positionsPromise = tanstackQueryClient.ensureQueryData(
    positionsMasterQueryOptions,
  );
  return { positions: positionsPromise };
}
