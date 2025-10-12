import { tanstackQueryClient } from "@/shared/api";import { departmentsMasterQueryOptions } from "./departments.api";export function loader() {
  const departmentsPromise = tanstackQueryClient.ensureQueryData(
    departmentsMasterQueryOptions,
  );
  return { departments: departmentsPromise };
}
