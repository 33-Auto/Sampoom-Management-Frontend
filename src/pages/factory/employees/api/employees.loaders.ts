import { queryClient } from "@/shared/api/query";

import { factoryEmployeesQueryOptions } from "./employees.api";

export function loader() {
  const employeesPromise = queryClient.ensureQueryData(
    factoryEmployeesQueryOptions,
  );
  return { employees: employeesPromise };
}
