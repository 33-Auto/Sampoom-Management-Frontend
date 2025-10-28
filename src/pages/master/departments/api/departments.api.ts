import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface DepartmentMaster {
  deptCode: string;
  deptName: string;
  parentDept: string;
  manager: string;
  employeeCount: number;
  budget: number;
  status: string;
  createdDate: string;
}

export const getDepartmentsMaster = async (): Promise<DepartmentMaster[]> => {
  const { data, error } = await fetchClient.GET(
    "/api/master/departments" as any,
    {
      params: { query: {} },
    },
  );

  if (error) {
    throw error;
  }
  return data || [];
};

export const departmentsMasterQueryOptions = {
  queryKey: ["master", "departments"],
  queryFn: getDepartmentsMaster,
};

export const useGetDepartmentsMasterQuery = () =>
  useQuery(departmentsMasterQueryOptions);
