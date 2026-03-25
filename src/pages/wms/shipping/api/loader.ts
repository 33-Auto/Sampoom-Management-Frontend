export async function loader() {
  const { queryClient } = await import("@/shared/api");
  const { wmsBranchesQueryOptions } = await import("@/entities/wms");
  const { shippingListQueryOptions } = await import("./shipping-list.api");

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
      shippingListQueryOptions({ warehouseId: defaultWarehouseId }),
    );
  }

  return { defaultWarehouseId };
}
