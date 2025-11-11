import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useFactoryBranchesQuery } from "@/entities/factory/api/factory.api";
import { useVendorsQuery } from "@/entities/vendor/api/vendor.api";
import { useWmsBrancesQuery } from "@/entities/wms/api/wms.api";
import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import { getWorkspaceLabel as resolveWorkspaceLabel } from "@/shared/constants/workspace";
import type { Schemas } from "@/shared/model";
import { Badge, Button, Card, SearchFilterBar, StatCard } from "@/shared/ui";

import { useUserInfoQuery } from "../api";

type UserInfo = Schemas["UserInfoResponse"];

export const HRMEmployees = () => {
  const navigate = useNavigate();
  const [workspaceFilter, setWorkspaceFilter] = useState<
    "FACTORY" | "WAREHOUSE" | "AGENCY" | ""
  >("");
  const [organizationIdFilter, setOrganizationIdFilter] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, setPage, onPageChange, onSizeChange } =
    usePaginationTable({});

  // 지점 목록 조회 (조직 타입에 따라)
  const { data: factoriesData } = useFactoryBranchesQuery();
  const { data: warehousesData } = useWmsBrancesQuery();
  const { data: vendorsData } = useVendorsQuery();

  // 현재 선택된 조직 타입에 따른 지점 목록
  const branchOptions = useMemo(() => {
    const options = [];

    // "전체" 옵션 추가
    if (workspaceFilter) {
      options.push({ value: "", label: "전체" });
    }

    if (workspaceFilter === "FACTORY") {
      const factories =
        factoriesData?.data?.map((factory: any) => ({
          value: String(factory.id),
          label: factory.name,
        })) || [];
      options.push(...factories);
    } else if (workspaceFilter === "WAREHOUSE") {
      const warehouses =
        warehousesData?.data?.map((warehouse: any) => ({
          value: String(warehouse.id),
          label: warehouse.name,
        })) || [];
      options.push(...warehouses);
    } else if (workspaceFilter === "AGENCY") {
      const vendors =
        vendorsData?.data?.map((vendor: any) => ({
          value: String(vendor.id),
          label: vendor.name,
        })) || [];
      options.push(...vendors);
    }

    return options;
  }, [workspaceFilter, factoriesData, warehousesData, vendorsData]);

  const workspaceParam = workspaceFilter
    ? (workspaceFilter as Schemas["UserInfoResponse"]["workspace"])
    : undefined;

  // API 호출
  const { data, isError, refetch, isLoading } = useUserInfoQuery({
    page,
    size,
    sort: ["id,DESC"],
    workspace: workspaceParam,
    organizationId: organizationIdFilter
      ? Number(organizationIdFilter)
      : undefined,
  });

  const users = data?.data?.users || [];
  const totalPages = data?.data?.meta?.totalPages ?? 0;
  const totalElements = data?.data?.meta?.totalElements ?? 0;

  // 헬퍼 함수들
  const workspaceFallbackLabels = {
    FACTORY: "공장",
    WAREHOUSE: "창고",
    AGENCY: "대리점",
  };

  const getWorkspaceLabel = (workspace: string | undefined) =>
    resolveWorkspaceLabel(workspace, workspaceFallbackLabels);

  const getPositionLabel = (position: string | undefined) => {
    if (!position) return "-";
    const positionMap: Record<string, string> = {
      STAFF: "사원",
      SENIOR_STAFF: "주임",
      ASSISTANT_MANAGER: "대리",
      MANAGER: "과장",
      SENIOR_MANAGER: "차장",
      DEPUTY_GENERAL_MANAGER: "부장",
      GENERAL_MANAGER: "부장",
      DIRECTOR: "이사",
      VICE_PRESIDENT: "부사장",
      PRESIDENT: "사장",
      CHAIRMAN: "회장",
    };
    return positionMap[position] || position;
  };

  const getStatusBadge = (status: string | undefined) => {
    if (status === "ACTIVE") {
      return <Badge variant="success">재직</Badge>;
    }
    if (status === "LEAVE") {
      return <Badge variant="warning">휴직</Badge>;
    }
    if (status === "RETIRED") {
      return <Badge variant="error">퇴직</Badge>;
    }
    return <Badge variant="error">비활성</Badge>;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return dateString.slice(0, 10);
  };

  // 통계 계산
  const totalEmployees = totalElements;
  const activeEmployees = users.filter(
    (u: UserInfo) => u.status === "ACTIVE",
  ).length;
  const leaveEmployees = users.filter(
    (u: UserInfo) => u.status === "LEAVE",
  ).length;
  const retiredEmployees = users.filter(
    (u: UserInfo) => u.status === "RETIRED",
  ).length;

  // 조직 필터 옵션
  const workspaceOptions = [
    { value: "", label: "전체 조직" },
    { value: "FACTORY", label: "공장" },
    { value: "WAREHOUSE", label: "창고" },
    { value: "AGENCY", label: "대리점" },
  ];

  // 조직 필터 변경 시 지점 필터 초기화
  const handleWorkspaceChange = (value: string) => {
    setWorkspaceFilter(value as "FACTORY" | "WAREHOUSE" | "AGENCY" | "");
    setOrganizationIdFilter("");
    setPage(0);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-team-line"
          label="총 직원 수"
          value={totalEmployees}
          iconBgColor="bg-teal-100"
          iconColor="text-teal-600"
        />
        <StatCard
          icon="ri-user-line"
          label="재직"
          value={activeEmployees}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon="ri-pause-circle-line"
          label="휴직"
          value={leaveEmployees}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-logout-circle-line"
          label="퇴직"
          value={retiredEmployees}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Filters and Actions */}
      <SearchFilterBar
        filters={[
          {
            key: "workspace",
            value: workspaceFilter,
            options: workspaceOptions,
            onChange: handleWorkspaceChange,
          },
          {
            key: "organization",
            value: organizationIdFilter,
            options: branchOptions,
            onChange: (value: string) => {
              setOrganizationIdFilter(value);
              setPage(0);
            },
            disabled: !workspaceFilter,
          },
        ]}
      />

      {/* Error Message */}
      {isError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          데이터를 불러오는데 실패했습니다.
          <Button
            className="ml-2"
            variant="default"
            size="sm"
            onClick={async () => refetch()}
          >
            다시 시도
          </Button>
        </div>
      )}

      {/* Employee List */}
      <PaginationTableSection
        title="직원 목록"
        totalElements={totalElements}
        page={page}
        totalPages={totalPages}
        size={size}
        onSizeChange={onSizeChange}
        onPageChange={onPageChange}
        showRefresh
        onRefresh={refetch}
      >
        <div className="space-y-4">
          {isLoading && users.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              데이터 로딩 중...
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              조건에 맞는 직원이 없습니다.
            </div>
          ) : (
            users.map((user: UserInfo) => (
              <Card key={user.userId}>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        {user.userName}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-white">
                        ({user.userId})
                      </span>
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                      <div>
                        <p className="text-gray-600 dark:text-white">
                          직급/조직
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getPositionLabel(user.position)}
                        </p>
                        <p className="text-gray-600 dark:text-white">
                          {getWorkspaceLabel(user.workspace)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-white">지점</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.branch}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-white">이메일</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <p className="text-gray-600 dark:text-white">
                          최초생성일
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-white">
                          근무시작일
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(user.startedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-white">
                          근무종료일
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(user.endedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-white">퇴사일</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatDate(user.deletedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        navigate(`/hrm/employees/status/${user.userId}`, {
                          state: { user },
                        });
                      }}
                    >
                      <i className="ri-user-settings-line"></i>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        navigate(`/hrm/employees/process/${user.userId}`, {
                          state: { user },
                        });
                      }}
                    >
                      <i className="ri-edit-line"></i>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </PaginationTableSection>
    </div>
  );
};
