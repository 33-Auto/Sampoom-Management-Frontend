import { queryClient } from "@/shared/api/query";

import { factoryBOMsQueryOptions } from "./bom.api";

export function loader() {
  const bomsPromise = queryClient.ensureQueryData(factoryBOMsQueryOptions);
  return { boms: bomsPromise };
}
