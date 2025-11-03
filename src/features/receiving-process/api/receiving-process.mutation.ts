import { queryClient } from "@/shared/api/base";

// Mutation을 사용해서 post 요청을 보내기
// open-api를 통해서 타입 정의는 openAPI 것을 사용
export const useReceivingProcessMutation = () =>
  queryClient.useMutation(
    "post",
    "/api/warehouse/receiving/{warehouseId}/process/{processId}",
  );
