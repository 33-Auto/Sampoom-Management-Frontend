import { useMemo } from "react";import { useAgencyBranchesQuery } from "../api/agency.api";export const useAgencyBranchOptions = () => {
  const { data } = useAgencyBranchesQuery();

  return useMemo(() => {
    const branches = (data as any)?.data ?? data ?? [];

    return [
      { label: "고객사 선택", value: undefined },
      ...branches
        .filter((branch: any) => branch?.status === "ACTIVE")
        .map((branch: any) => ({
          label: branch.name,
          value: String(branch.id),
        })),
    ];
  }, [data]);
};
