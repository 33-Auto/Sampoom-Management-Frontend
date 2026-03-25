import { queryClient } from "@/shared/api";

import { departmentsMasterQueryOptions } from "./departments.api";

export function loader() {
  const departmentsPromise = queryClient.ensureQueryData(
    departmentsMasterQueryOptions,
  );
  return { departments: departmentsPromise };
}
