export async function ropSettingsLoader() {
  const { queryClient } = await import("@/shared/api/query");
  const { wmsBranchesQueryOptions } = await import("@/entities/wms");
  const { ropSettingsQueryOptions } = await import("./rop-settings.api");

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
      ropSettingsQueryOptions({ warehouseId: defaultWarehouseId }),
    );
  }

  return { defaultWarehouseId };
}
