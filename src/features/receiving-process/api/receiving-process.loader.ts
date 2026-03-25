import { queryClient as tanstackQueryClient } from "@/shared/api";

import { receivingProcessQueryOptions } from "./receiving-process.api";

// 추후에 수정 버튼을 눌렀을 경우 처리
export function ReceivingProcessLoader(warehouseId: number, processId: number) {
  tanstackQueryClient.prefetchQuery(
    receivingProcessQueryOptions(warehouseId, processId),
  );
  return null;
}
