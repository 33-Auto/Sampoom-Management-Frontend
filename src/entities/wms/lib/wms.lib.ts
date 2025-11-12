import { useMemo } from "react";

import { useWmsBrancesQuery } from "../api";

type RawBranch = {
  id?: number;
  name?: string;
  status?: string;
};

type WarehouseBranch = RawBranch & { id: number };

const useWarehousesRaw = (): RawBranch[] => {
  const { data } = useWmsBrancesQuery();

  return useMemo<RawBranch[]>(() => {
    const branches = (data as any)?.data ?? data ?? [];

    if (!Array.isArray(branches)) {
      return [];
    }

    return branches.map((branch: any) => {
      const normalized: RawBranch = {};

      if (typeof branch?.id === "number" && Number.isFinite(branch.id)) {
        normalized.id = branch.id;
      }
      if (typeof branch?.name === "string") {
        normalized.name = branch.name;
      }
      if (typeof branch?.status === "string") {
        normalized.status = branch.status;
      }

      return normalized;
    });
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
        (branch): branch is WarehouseBranch =>
          typeof branch.id === "number" && Number.isFinite(branch.id),
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
