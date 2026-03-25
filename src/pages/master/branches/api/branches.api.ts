import type { BranchListParams } from "@/entities/branch";
import { api } from "@/shared/api";

// 공통 옵션 생성 함수
const getBranchesQueryOptions = (params?: BranchListParams) => ({
  params: {
    query: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      keyword: params?.keyword,
      type: params?.type,
      status: params?.status,
    },
  },
});

// queryOptions를 반환하는 함수 (loader 등에서 사용)
export const branchesListQueryOptions = (params?: BranchListParams) =>
  api.queryOptions(
    "get",
    "/api/site/branches/search",
    getBranchesQueryOptions(params),
  );

// useQuery hook (컴포넌트에서 사용)
export const useBranchesQuery = (params?: BranchListParams) =>
  api.useQuery(
    "get",
    "/api/site/branches/search",
    getBranchesQueryOptions(params),
    {
      placeholderData: (previousData) => previousData, // 이전 페이지 데이터를 유지하여 깜빡임 최소화
    },
  );
