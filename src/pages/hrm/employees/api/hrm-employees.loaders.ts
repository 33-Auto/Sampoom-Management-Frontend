import { queryClient } from "@/shared/api";

import { userInfoQueryOptions } from "./hrm-employees.api";

export function loader() {
  // 화면이 이 promise를 받지 않아서, 쿼리가 취소되면 처리되지 않은 CancelledError가 났다.
  // 캐시를 미리 채우는 용도이므로 실패는 삼킨다.
  const usersPromise = queryClient
    .ensureQueryData(
      userInfoQueryOptions({
        page: 0,
        size: 10,
        sort: ["id,DESC"],
      }),
    )
    .catch(() => undefined);
  return { users: usersPromise };
}
