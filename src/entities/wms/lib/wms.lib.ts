import { useMemo } from "react";

import { useWmsBrancesQuery } from "../api";

const useWarehousesRaw = () => {
  const { data } = useWmsBrancesQuery();

  return useMemo(() => {
    const branches = (data as any)?.data ?? data ?? [];

    return Array.isArray(branches)
      ? branches.map((branch: any) => ({
          id: typeof branch?.id === "number" ? branch.id : undefined,
          name: branch?.name,
          status: branch?.status,
        }))
      : [];
  }, [data]);
};

export function useWmsBranchOptions() {
  const branches = useWarehousesRaw();

  return useMemo(
    () =>
      branches
        .filter(
          (branch) => branch.id !== undefined && branch.status === "ACTIVE",
        )
        .map((branch) => ({
          label: branch.name ?? String(branch.id),
          value: String(branch.id),
        })),
    [branches],
  );
}

export function useWarehouses() {
  const branches = useWarehousesRaw();

  return useMemo(
    () =>
      branches.filter(
        (
          branch,
        ): branch is {
          id: number;
          name?: string;
          status?: string;
        } => typeof branch.id === "number" && Number.isFinite(branch.id),
      ),
    [branches],
  );
}

export function useWarehouseIds() {
  const warehouses = useWarehouses();

  return useMemo(
    () => warehouses.map((warehouse) => warehouse.id),
    [warehouses],
  );
}
