import { useMutation } from "@tanstack/react-query";import { fetchClient, tanstackQueryClient } from "@/shared/api";import type { DepartmentMaster } from "./departments.api";export interface CreateDepartmentRequest
  extends Omit<DepartmentMaster, "deptCode"> {}

export interface UpdateDepartmentRequest extends Partial<DepartmentMaster> {}

export const createDepartment = async (
  deptData: CreateDepartmentRequest,
): Promise<DepartmentMaster> => {
  const { data, error } = await fetchClient.POST(
    "/api/master/departments" as any,
    {
      body: deptData,
    },
  );
  if (error) throw error;
  return data as DepartmentMaster;
};

export const updateDepartment = async (
  deptCode: string,
  updates: UpdateDepartmentRequest,
): Promise<DepartmentMaster> => {
  const { data, error } = await fetchClient.PUT(
    "/api/master/departments/{deptCode}" as any,
    {
      params: { path: { deptCode } },
      body: updates,
    },
  );
  if (error) throw error;
  return data as DepartmentMaster;
};

export const useCreateDepartment = () => {
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ["master", "departments"] });
    },
  });
};

export const useUpdateDepartment = () => {
  return useMutation({
    mutationFn: async ({
      deptCode,
      updates,
    }: {
      deptCode: string;
      updates: UpdateDepartmentRequest;
    }) => updateDepartment(deptCode, updates),
    onSuccess: () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ["master", "departments"] });
    },
  });
};
