import { useMemo } from "react";

import { useWmsBrancesQuery } from "../api";

export function useWmsBranchOptions() {
  const { data } = useWmsBrancesQuery();

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
