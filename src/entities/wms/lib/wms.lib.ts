import { useMemo } from "react";

import { useWmsBrancesQuery } from "../api";

export function useWmsBranchOptions() {
  const { data } = useWmsBrancesQuery();

  return useMemo(() => {
    const branches = (data as any)?.data ?? data ?? [];
    return [
      { label: "창고 선택", value: "" },
      ...branches
        .filter((branch: any) => branch?.status === "ACTIVE")
        .map((branch: any) => ({
          label: branch.name,
          value: String(branch.id),
        })),
    ];
  }, [data]);
}
