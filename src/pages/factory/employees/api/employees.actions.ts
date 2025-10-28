import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetchClient } from "@/shared/api";

import type { FactoryEmployee } from "./employees.api";

export interface AttendanceRequest {
  action: "checkIn" | "checkOut";
  timestamp: string;
}

export interface CreateEmployeeRequest extends Omit<FactoryEmployee, "id"> {}

export interface UpdateEmployeeRequest extends Partial<FactoryEmployee> {}

// 직원 등록
export const createFactoryEmployee = async (
  employeeData: CreateEmployeeRequest,
): Promise<FactoryEmployee> => {
  const { data, error } = await fetchClient.POST(
    "/api/factory/employees" as any,
    {
      body: employeeData,
    },
  );
  if (error) throw error;
  return data as FactoryEmployee;
};

// 직원 정보 수정
export const updateFactoryEmployee = async (
  employeeId: string,
  updates: UpdateEmployeeRequest,
): Promise<FactoryEmployee> => {
  const { data, error } = await fetchClient.PUT(
    "/api/factory/employees/{employeeId}" as any,
    {
      params: { path: { employeeId } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as FactoryEmployee;
};

// 직원 출입 기록
export const recordAttendance = async (
  employeeId: string,
  attendanceData: AttendanceRequest,
): Promise<FactoryEmployee> => {
  const { data, error } = await fetchClient.POST(
    "/api/factory/employees/{employeeId}/attendance" as any,
    {
      params: { path: { employeeId } },
      body: attendanceData,
    },
  );
  if (error) throw error;
  return data as FactoryEmployee;
};

// React Query Hooks for Mutations

export const useCreateFactoryEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFactoryEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factory", "employees"] });
    },
  });
};

export const useUpdateFactoryEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      updates,
    }: {
      employeeId: string;
      updates: UpdateEmployeeRequest;
    }) => updateFactoryEmployee(employeeId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factory", "employees"] });
    },
  });
};

export const useRecordAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      employeeId,
      attendanceData,
    }: {
      employeeId: string;
      attendanceData: AttendanceRequest;
    }) => recordAttendance(employeeId, attendanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factory", "employees"] });
    },
  });
};
