import { wmsBranchesQueryOptions } from "@/entities/wms";
import { queryClient } from "@/shared/api";

import { ropSettingsListQueryOptions } from "./rop-settings.api";

export async function ropSettingsLoader() {
  const branchesData = await queryClient.ensureQueryData(
    wmsBranchesQueryOptions(),
  );

  const branches = (branchesData as any)?.data ?? branchesData ?? [];
  const firstActive = branches.find(
    (branch: any) =>
      branch?.status === "ACTIVE" &&
      branch?.id !== null &&
      branch?.id !== undefined,
  );

  const defaultWarehouseId =
    typeof firstActive?.id === "number" ? firstActive.id : undefined;

  if (typeof defaultWarehouseId === "number") {
    await queryClient.ensureQueryData(
      ropSettingsListQueryOptions({ warehouseId: defaultWarehouseId }),
    );
  }

  return { defaultWarehouseId };
}
