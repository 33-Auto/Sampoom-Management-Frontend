import { useMemo } from "react";

import type { BranchResponseDTO } from "./branches.model";

export const useBranchStats = (data: BranchResponseDTO[]) => {
  return useMemo(() => {
    const totalBranches = data.length;
    const activeBranches = data.filter(
      (branch) => branch.status === "ACTIVE",
    ).length;
    const warehouses = data.filter(
      (branch) => branch.type === "WAREHOUSE",
    ).length;
    const factories = data.filter((branch) => branch.type === "FACTORY").length;

    return {
      totalBranches,
      activeBranches,
      warehouses,
      factories,
    };
  }, [data]);
};
