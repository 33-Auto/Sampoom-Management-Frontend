import { queryClient } from "@/shared/api/query";

import { ropSettingsQueryOptions } from "./rop-settings.api";

export function ropSettingsLoader() {
  queryClient.prefetchQuery(ropSettingsQueryOptions({ warehouseId: 40 }));
  return null;
}
