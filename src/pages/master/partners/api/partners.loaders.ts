import { queryClient } from "@/shared/api/query";

import { partnersMasterQueryOptions } from "./partners.api";

export function loader() {
  const partnersPromise = queryClient.ensureQueryData(
    partnersMasterQueryOptions,
  );
  return { partners: partnersPromise };
}
