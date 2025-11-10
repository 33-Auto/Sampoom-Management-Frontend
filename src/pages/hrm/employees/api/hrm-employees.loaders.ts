import { queryClient } from "@/shared/api/query";

import { userInfoQueryOptions } from "./hrm-employees.api";

export function loader() {
  const usersPromise = queryClient.ensureQueryData(
    userInfoQueryOptions({
      page: 0,
      size: 10,
      sort: ["id,DESC"],
    }),
  );
  return { users: usersPromise };
}
