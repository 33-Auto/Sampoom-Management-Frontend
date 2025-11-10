import { useMemo } from "react";

import { useFactoryBranchesQuery } from "../api";

export function useFactoryBranchOptions() {
  const { data } = useFactoryBranchesQuery();

  return useMemo(() => {
    const branches = (data as any)?.data ?? data ?? [];
    return branches
      .filter(
        (branch: any) =>
          branch?.status === "ACTIVE" &&
          branch?.id !== null &&
          branch?.id !== undefined,
      )
      .map((branch: any) => ({
        label: branch.name,
        value: String(branch.id),
      }));
  }, [data]);
}
