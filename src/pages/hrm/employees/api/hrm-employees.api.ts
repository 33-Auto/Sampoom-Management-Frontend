import { queryClient } from "@/shared/api";
import type { Operations } from "@/shared/model";

// 공통 옵션 생성 함수
const getUserInfoQueryOptions = (
  params?: Operations["getUsersInfo"]["parameters"]["query"],
) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sort: params?.sort ?? ["id,DESC"],
      workspace: params?.workspace,
      organizationId: params?.organizationId,
    },
  },
});

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const userInfoQueryOptions = (
  params?: Operations["getUsersInfo"]["parameters"]["query"],
) =>
  queryClient.queryOptions(
    "get",
    "/api/user/info" as any,
    getUserInfoQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useUserInfoQuery = (
  params?: Operations["getUsersInfo"]["parameters"]["query"],
) =>
  queryClient.useQuery(
    "get",
    "/api/user/info" as any,
    getUserInfoQueryOptions(params),
    {
      placeholderData: (previousData: any) => previousData,
    },
  );

// 공장, 창고, 대리점 목록은 entities에서 가져옴

// 프로필 수정
export const useUpdateProfileMutation = () =>
  queryClient.useMutation("patch", "/api/user/profile/{userId}");

// 상태 변경
export const useUpdateStatusMutation = () =>
  queryClient.useMutation("patch", "/api/user/status/{userId}");
