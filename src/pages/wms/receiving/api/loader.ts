import { queryClient as tanstackQueryClient } from "@/shared/api/query";

import { queryOptions } from "./receiving.api";

export function loader() {
  //* 라우터에 prefetch를 위해 쿼리를 실행
  tanstackQueryClient.ensureQueryData(queryOptions);
  return null;
}
