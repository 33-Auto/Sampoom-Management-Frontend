import { queryClient } from "@/shared/api/query";

import { bomMasterQueryOptions } from "./bom.api";

export function loader() {
  const bomsPromise = queryClient.ensureQueryData(bomMasterQueryOptions);
  return { boms: bomsPromise };
}
