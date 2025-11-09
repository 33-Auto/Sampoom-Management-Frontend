import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";
import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import { useRoutingsQuery } from "@/pages/master/routings/api";
import type {
  ProcessResponseDTO,
  RoutingStatus,
} from "@/pages/master/routings/model";
import { ROUTING_STATUS } from "@/pages/master/routings/model";
import { useRoutingStats } from "@/pages/master/routings/model/useRoutingStats";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
} from "@/shared/ui";

export const RoutingMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedRouting, setSelectedRouting] =
    useState<ProcessResponseDTO | null>(null);

  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

  const { data, isError, refetch } = useRoutingsQuery({
    query: searchTerm === "" ? undefined : searchTerm,
    status: statusFilter === "" ? undefined : (statusFilter as RoutingStatus),
    categoryId: categoryFilter === "" ? undefined : Number(categoryFilter),
    groupId: groupFilter === "" ? undefined : Number(groupFilter),
    page,
    size,
  });

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;
  const routings = data?.data?.content ?? [];

  const categoryOptions = usePartCategoryOptions();
  const groupOptions = usePartGroupOptions(
    categoryFilter === "" ? 0 : Number(categoryFilter),
  );

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(ROUTING_STATUS)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const statusLabels: Record<string, string> = {
          ACTIVE: "활성",
          INACTIVE: "비활성",
        };
        return { value: value as string, label: statusLabels[key] || key };
      }),
  ];

  const handleCreateNew = () => {
    navigate("/master/routings/process");
  };

  const handleViewDetail = (row: ProcessResponseDTO) => {
    navigate(`/master/routings/process/${row.id}`, {
      state: { routingData: row },
    });
  };

  const keys = createKeyRecord<ProcessResponseDTO>(routings);
  const columns = [
    { key: keys.code, title: "공정 코드", width: "120px" },
    { key: keys.partCode, title: "품목 코드", width: "120px" },
    { key: keys.partName, title: "품목명" },
    {
      key: keys.categoryName,
      title: "카테고리",
      width: "120px",
      render: (value: string, row: ProcessResponseDTO) =>
        `${row.categoryName || "-"} > ${row.groupName || "-"}`,
    },
    { key: keys.version, title: "버전", width: "80px" },
    {
      key: keys.totalStepMinutes,
      title: "총 리드타임",
      width: "120px",
      render: (value: number) => `${value || 0}분`,
    },
    {
      key: keys.stepCount,
      title: "공정 수",
      width: "80px",
      render: (value: number) => `${value || 0}개`,
    },
    {
      key: keys.status,
      title: "상태",
      width: "80px",
      render: (value: string) => (
        <Badge variant={value === "ACTIVE" ? "success" : "default"}>
          {value === "ACTIVE" ? "활성" : "비활성"}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "작업",
      width: "150px",
      render: (_value: any, row: ProcessResponseDTO) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedRouting(row)}
          >
            <i className="ri-eye-line mr-1"></i>
            상세
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetail(row)}
          >
            <i className="ri-edit-line mr-1"></i>
            편집
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산 (훅으로 분리)
  const { totalRoutings, activeRoutings, avgLeadTime, avgOperations } =
    useRoutingStats(routings);

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 좌측: 공정 목록 */}
        <div className="lg:col-span-2">
          {/* 통계 카드 */}
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
            <StatCard
              icon="ri-route-line"
              label="전체 공정"
              value={totalRoutings}
              iconBgColor="bg-main-100"
              iconColor="text-main-600"
            />

            <StatCard
              icon="ri-check-line"
              label="활성 공정"
              value={activeRoutings}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />

            <StatCard
              icon="ri-time-line"
              label="평균 리드타임"
              value={`${avgLeadTime}분`}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />

            <StatCard
              icon="ri-list-check"
              label="평균 공정수"
              value={`${avgOperations}개`}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          {/* 필터 및 검색 */}
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              onPageChange(0);
            }}
            searchPlaceholder="품목명, 코드 또는 공정 코드 검색..."
            filters={[
              {
                key: "category",
                value: categoryFilter,
                options: categoryOptions,
                onChange: (value: string) => {
                  setCategoryFilter(value);
                  onPageChange(0);
                },
              },
              {
                key: "group",
                value: groupFilter,
                options: groupOptions,
                onChange: (value: string) => {
                  setGroupFilter(value);
                  onPageChange(0);
                },
              },
              {
                key: "status",
                value: statusFilter,
                options: statusOptions,
                onChange: (value) => {
                  setStatusFilter(value);
                  onPageChange(0);
                },
              },
            ]}
            actions={
              <Button variant="default" size="sm" onClick={handleCreateNew}>
                <i className="ri-add-line mr-2"></i>
                신규 등록
              </Button>
            }
          />

          {/* 공정 목록 테이블 */}
          <PaginationTableSection
            title="공정 목록"
            totalElements={totalElements}
            page={page}
            totalPages={totalPages}
            size={size}
            onSizeChange={onSizeChange}
            onPageChange={onPageChange}
            showRefresh
            onRefresh={refetch}
          >
            <Table
              columns={columns}
              data={routings}
              emptyText={
                isError && data === undefined
                  ? "데이터 로딩 중 오류가 발생했습니다."
                  : "조건에 맞는 공정이 없습니다"
              }
              errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
            />
          </PaginationTableSection>
        </div>

        {/* 우측: 공정 상세 정보 */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                공정 상세 정보
              </h3>
            </div>
            <div className="p-6">
              {selectedRouting ? (
                <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      기본 정보
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          공정 코드:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.code || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          품목 코드:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.partCode || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          품목명:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.partName || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          카테고리:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.categoryName +
                            " > " +
                            selectedRouting.groupName || "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          버전:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.version || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 공정 순서 */}
                  {selectedRouting.steps &&
                    selectedRouting.steps.length > 0 && (
                      <div>
                        <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                          공정 순서
                        </h4>
                        <div className="space-y-3">
                          {selectedRouting.steps.map((step, index) => (
                            <div
                              key={index}
                              className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {step.stepOrder}. {step.stepName || "-"}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {step.workCenterCode || "-"}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <div>
                                  <span className="block text-gray-500 dark:text-gray-500">
                                    준비시간
                                  </span>
                                  <span className="font-medium">
                                    {step.setupMinutes || 0}분
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-gray-500 dark:text-gray-500">
                                    가공시간
                                  </span>
                                  <span className="font-medium">
                                    {step.processMinutes || 0}분
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-gray-500 dark:text-gray-500">
                                    대기시간
                                  </span>
                                  <span className="font-medium">
                                    {step.waitMinutes || 0}분
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 총 시간 요약 */}
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      시간 요약
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          총 준비시간:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.totalSetupMinutes || 0}분
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          총 가공시간:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.totalProcessMinutes || 0}분
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          총 대기시간:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {selectedRouting.totalWaitMinutes || 0}분
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-gray-300 pt-2 dark:border-gray-600">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          총 리드타임:
                        </span>
                        <span className="font-bold text-main-600 dark:text-main-400">
                          {selectedRouting.totalStepMinutes || 0}분
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <i className="ri-route-line mb-4 text-4xl text-gray-300 dark:text-gray-600"></i>
                  <p className="text-gray-500 dark:text-gray-400">
                    공정을 선택하면 상세 정보가 표시됩니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 공정 관리 안내 */}
      <InfoBox type="success" title="공정 기반 리드 타임 자동 계산">
        <p className="mb-1">
          • <strong>동적 계산:</strong> 생산 수량 × 단위당 가공시간 + 준비시간 +
          대기시간
        </p>
        <p className="mb-1">
          • <strong>작업장 연계:</strong> 각 공정의 작업장 능력을 반영한 정확한
          스케줄링
        </p>
        <p>
          • <strong>실시간 업데이트:</strong> 공정 변경 시 품목 마스터의 생산
          리드 타임 자동 갱신
        </p>
      </InfoBox>
    </>
  );
};
