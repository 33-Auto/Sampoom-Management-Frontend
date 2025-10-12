export async function loader() {
  const { tanstackQueryClient } = await import("@/shared/api");
  const { wmsBranchesQueryOptions } = await import("@/entities/wms");
  const { salesOrdersListQueryOptions } = await import("./sales-orders.api");

  const branchesData = await tanstackQueryClient.ensureQueryData(
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
    await tanstackQueryClient.ensureQueryData(
      salesOrdersListQueryOptions({ warehouseId: defaultWarehouseId }),
    );
  }

  return { defaultWarehouseId };
}
