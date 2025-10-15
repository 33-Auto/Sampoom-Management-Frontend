import { useState } from "react";import { useNavigate } from "react-router-dom";import { usePartCategoryOptions, usePartGroupOptions } from "@/entities/part";import { MasterListLayout, useMasterListControls } from "@/features/master-list";import { useRoutingsQuery } from "../api";import type { ProcessResponseDTO, RoutingStatus } from "@/pages/master/routings/model";import { createKeyRecord } from "@/shared/lib";import { Button, InfoBox } from "@/shared/ui";import { createRoutingColumns, createRoutingFilters } from "./masterListConfig";export const RoutingMaster = () => {
  const navigate = useNavigate();
  const [selectedRouting, setSelectedRouting] =
    useState<ProcessResponseDTO | null>(null);
  const {
    searchTerm,
    handleSearchChange,
    filters,
    handleFilterChange,
    pagination,
  } = useMasterListControls([
    { key: "category" },
    { key: "group" },
    { key: "status" },
  ]);

  const categoryFilter = filters.category ?? "";
  const groupFilter = filters.group ?? "";
  const statusFilter = filters.status ?? "";
  const { page, size, onPageChange, onSizeChange } = pagination;

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

  const handleCreateNew = () => {
    navigate("/master/routings/process");
  };

  const handleViewDetail = (row: ProcessResponseDTO) => {
    navigate(`/master/routings/process/${row.id}`, {
      state: { routingData: row },
    });
  };

  const keys = createKeyRecord<ProcessResponseDTO>(routings);
  const columns = createRoutingColumns({
    keys,
    onInspect: setSelectedRouting,
    onEdit: handleViewDetail,
  });

  const filterConfigs = createRoutingFilters({
    categoryValue: categoryFilter,
    groupValue: groupFilter,
    statusValue: statusFilter,
    categoryOptions,
    groupOptions,
    onCategoryChange: (value) => {
      handleFilterChange("category", value);
      handleFilterChange("group", "");
    },
    onGroupChange: (value) => handleFilterChange("group", value),
    onStatusChange: (value) => handleFilterChange("status", value),
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <MasterListLayout
        title="공정 목록"
        search={{
          term: searchTerm,
          onChange: handleSearchChange,
          placeholder: "품목명, 코드 또는 공정 코드 검색...",
        }}
        filters={filterConfigs}
        actions={
          <Button variant="default" size="sm" onClick={handleCreateNew}>
            <i className="ri-add-line mr-2"></i>
            신규 등록
          </Button>
        }
        table={{
          columns,
          data: routings,
          loading: false,
          emptyText:
            isError && data === undefined
              ? "데이터 로딩 중 오류가 발생했습니다."
              : "조건에 맞는 공정이 없습니다",
          errorText: isError ? "데이터 로딩 중 오류가 발생했습니다." : "",
        }}
        pagination={{
          totalElements,
          page,
          totalPages,
          size,
          onPageChange,
          onSizeChange,
          showRefresh: true,
          onRefresh: refetch,
        }}
        asideSlot={
          <div className="sticky top-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
            <div className="border-b border-gray-200 p-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                공정 상세 정보
              </h3>
            </div>
            <div className="p-6">
              {selectedRouting ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      기본 정보
                    </h4>
                    <div className="space-y-2 text-sm">
                      <DetailRow
                        label="공정 코드"
                        value={selectedRouting.code}
                      />
                      <DetailRow
                        label="품목 코드"
                        value={selectedRouting.partCode}
                      />
                      <DetailRow
                        label="품목명"
                        value={selectedRouting.partName}
                      />
                      <DetailRow
                        label="카테고리"
                        value={`${selectedRouting.categoryName || "-"} > ${selectedRouting.groupName || "-"}`}
                      />
                      <DetailRow label="버전" value={selectedRouting.version} />
                    </div>
                  </div>
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
                                <DetailMetric
                                  label="준비시간"
                                  value={`${step.setupMinutes || 0}분`}
                                />
                                <DetailMetric
                                  label="가공시간"
                                  value={`${step.processMinutes || 0}분`}
                                />
                                <DetailMetric
                                  label="대기시간"
                                  value={`${step.waitMinutes || 0}분`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                      시간 요약
                    </h4>
                    <div className="space-y-1 text-sm">
                      <DetailRow
                        label="총 준비시간"
                        value={`${selectedRouting.totalSetupMinutes || 0}분`}
                        compact
                      />
                      <DetailRow
                        label="총 가공시간"
                        value={`${selectedRouting.totalProcessMinutes || 0}분`}
                        compact
                      />
                      <DetailRow
                        label="총 대기시간"
                        value={`${selectedRouting.totalWaitMinutes || 0}분`}
                        compact
                      />
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
        }
      />

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
    </div>
  );
};

const DetailRow = ({
  label,
  value,
  compact = false,
}: {
  label: string;
  value?: string | number | null;
  compact?: boolean;
}) => (
  <div
    className={`flex justify-between ${
      compact ? "" : "text-gray-600 dark:text-gray-400"
    }`}
  >
    <span className="text-gray-600 dark:text-gray-400">{label}:</span>
    <span className="font-medium text-gray-900 dark:text-gray-100">
      {value || "-"}
    </span>
  </div>
);

const DetailMetric = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-gray-500 dark:text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
