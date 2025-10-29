import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

export interface FactoryEmployee {
  id: string;
  name: string;
  position: string;
  department: string;
  shift: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  workHours: number;
  targetHours: number;
  phone: string;
  email: string;
  hireDate: string;
  experience: string;
  certifications: string[];
  currentTask: string;
}

// 전체 직원 목록 조회
export const getFactoryEmployees = async (): Promise<FactoryEmployee[]> => {
  const { data, error } = await fetchClient.GET(
    "/api/factory/employees" as any,
    {
      params: { query: {} },
    },
  );

  if (error) {
    throw error;
  }
  return data || [];
};

export const factoryEmployeesQueryOptions = {
  queryKey: ["factory", "employees"],
  queryFn: getFactoryEmployees,
};

export const useGetFactoryEmployeesQuery = () =>
  useQuery(factoryEmployeesQueryOptions);
