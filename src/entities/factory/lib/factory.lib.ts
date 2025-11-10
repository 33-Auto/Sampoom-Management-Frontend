import { useMemo } from "react";

import { useFactoryBranchesQuery } from "../api";

export function useFactoryBranchOptions() {
  const { data } = useFactoryBranchesQuery();

  return useMemo(() => {
    const branches = (data as any)?.data ?? data ?? [];
    return [
      { label: "지점 선택", value: "" },
      ...branches
        .filter((branch: any) => branch?.status === "ACTIVE")
        .map((branch: any) => ({
          label: branch.name,
          value: String(branch.id),
        })),
    ];
  }, [data]);
}
