import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { workCenterMasterData } from "@/mocks/factoryData";
import { useTableFilter } from "@/shared/lib/hooks";
import {
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { useWorkCenterStats } from "../model/useWorkCenterStats";

export const WorkCenterMaster = () => {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  const typeOptions = [
    { value: "전체", label: "전체 유형" },
    { value: "내부 설비", label: "내부 설비" },
    { value: "외주 가공처", label: "외주 가공처" },
    { value: "검사 설비", label: "검사 설비" },
  ];

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "가동", label: "가동" },
    { value: "정비", label: "정비" },
    { value: "중단", label: "중단" },
  ];

  const { searchTerm, setSearchTerm, filteredData } = useTableFilter({
    data: workCenterMasterData,
    searchFields: ["workCenterName", "workCenterCode"],
    filters: [
      {
        key: "type",
        state: typeFilter,
        setState: setTypeFilter,
        options: typeOptions,
        matchFn: (item, value) => value === "전체" || item.type === value,
      },
      {
        key: "status",
        state: statusFilter,
        setState: setStatusFilter,
        options: statusOptions,
        matchFn: (item, value) => value === "전체" || item.status === value,
      },
    ],
  });

  const columns = [
    { key: "workCenterCode", title: "작업장 코드", width: "120px" },
    { key: "workCenterName", title: "작업장명" },
    {
      key: "type",
      title: "유형",
      width: "120px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "내부 설비"
              ? "bg-blue-100 text-blue-800"
              : value === "외주 가공처"
                ? "bg-orange-100 text-orange-800"
                : "bg-purple-100 text-purple-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "dailyCapacity",
      title: "일일 가용시간",
      width: "120px",
      render: (value: number) => `${value}시간`,
    },
    {
      key: "efficiency",
      title: "효율",
      width: "80px",
      render: (value: number) => `${value}%`,
    },
    {
      key: "hourlyRate",
      title: "시간당 비용",
      width: "120px",
      render: (value: number) => `₩${value?.toLocaleString()}`,
    },
    {
      key: "status",
      title: "상태",
      width: "80px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "가동"
              ? "bg-green-100 text-green-800"
              : value === "정비"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: () => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <i className="ri-edit-line mr-1"></i>
            편집
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산 (훅으로 분리)
  const {
    totalWorkCenters,
    activeWorkCenters,
    internalWorkCenters,
    externalWorkCenters,
    totalCapacity,
    avgHourlyRate,
  } = useWorkCenterStats(workCenterMasterData);

  return (
    <>
      {/* 메인 컨텐츠 */}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-6">
        <StatCard
          icon="ri-tools-line"
          label="전체 작업장"
          value={totalWorkCenters}
          iconBgColor="bg-main-100"
          iconColor="text-main-600"
        />

        <StatCard
          icon="ri-play-circle-line"
          label="가동 중"
          value={activeWorkCenters}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          icon="ri-building-line"
          label="내부 설비"
          value={internalWorkCenters}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          icon="ri-truck-line"
          label="외주 가공처"
          value={externalWorkCenters}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatCard
          icon="ri-time-line"
          label="총 가용능력"
          value={`${Math.round(totalCapacity)}h`}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          icon="ri-money-dollar-circle-line"
          label="평균 시간당 비용"
          value={`₩${avgHourlyRate.toLocaleString()}`}
          iconBgColor="bg-teal-100"
          iconColor="text-teal-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="작업장명 또는 코드 검색..."
        filters={[
          {
            key: "type",
            value: typeFilter,
            options: typeOptions,
            onChange: setTypeFilter,
          },
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
        ]}
        actions={
          <>
            <Button
              variant="default"
              size="sm"
              onClick={async () => navigate("/master/workcenters/create")}
            >
              <i className="ri-add-line mr-2"></i>
              신규 등록
            </Button>
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
          </>
        }
      />

      {/* 작업장 능력 관리 안내 */}
      <InfoBox type="info" title="작업장 능력 관리 안내">
        <p className="mb-1">
          • <strong>가용 능력:</strong> 일일 최대 가동 시간 × 효율(%) = 실제
          생산 가능 시간
        </p>
        <p className="mb-1">
          • <strong>시간당 비용:</strong> 노무비 + 제조경비 + 설비 감가상각비
          포함
        </p>
        <p>
          • <strong>생산 스케줄링:</strong> 각 작업장의 능력을 기반으로 최적
          일정 계획 수립
        </p>
      </InfoBox>

      {/* 작업장 목록 테이블 */}
      <TableSection
        title="작업장 목록"
        metaRight={
          <span className="text-sm text-gray-500">
            총 {filteredData.length}개 작업장
          </span>
        }
        actionsRight={
          <Button variant="secondary" size="sm">
            <i className="ri-refresh-line mr-2"></i>
            새로고침
          </Button>
        }
      >
        <Table
          columns={columns}
          data={filteredData}
          emptyText="조건에 맞는 작업장이 없습니다"
        />
      </TableSection>
    </>
  );
};
