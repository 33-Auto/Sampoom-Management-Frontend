import { tanstackQueryClient } from "@/shared/api";import { userInfoQueryOptions } from "./hrm-employees.api";export function loader() {
  const usersPromise = tanstackQueryClient.ensureQueryData(
    userInfoQueryOptions({
      page: 0,
      size: 10,
      sort: ["id,DESC"],
    }),
  );
  return { users: usersPromise };
}
