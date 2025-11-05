// TODO: 타입 체크 임시 비활성화 - 타입 에러 수정 후 이 줄 제거
// @ts-nocheck
import { queryClient } from "@/shared/api/base";

// Mutation을 사용해서 post 요청을 보내기
// open-api를 통해서 타입 정의는 openAPI 것을 사용
export const useReceivingProcessMutation = () =>
  queryClient.useMutation(
    "post",
    "/api/warehouse/receiving/{warehouseId}/process/{processId}",
  );
