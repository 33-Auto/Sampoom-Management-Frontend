export async function loader() {
  const { queryClient } = await import("@/shared/api");
  const { factoryBranchesQueryOptions } = await import("@/entities/factory");
  const { productionPlansListQueryOptions } = await import("./planning.api");

  const branchesData = await queryClient.ensureQueryData(
    factoryBranchesQueryOptions(),
  );

  const branches = (branchesData as any)?.data ?? branchesData ?? [];
  const firstActive = branches.find(
    (branch: any) =>
      branch?.status === "ACTIVE" &&
      branch?.id !== null &&
      branch?.id !== undefined,
  );

  const defaultFactoryId =
    typeof firstActive?.id === "number" ? firstActive.id : undefined;

  if (typeof defaultFactoryId === "number") {
    await queryClient.ensureQueryData(
      productionPlansListQueryOptions({ factoryId: defaultFactoryId }),
    );
  }

  return { defaultFactoryId };
}
