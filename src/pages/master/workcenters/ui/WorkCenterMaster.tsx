import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PaginationTableSection } from "@/features/table-pagination";
import { usePaginationTable } from "@/features/table-pagination/lib/hook/usePaginationTable";
import { useWorkCentersQuery } from "@/pages/master/workcenters/api";
import type {
  WorkCenterResponseDTO,
  WorkCenterStatus,
  WorkCenterType,
} from "@/pages/master/workcenters/model";
import {
  WORK_CENTER_STATUS,
  WORK_CENTER_TYPE,
} from "@/pages/master/workcenters/model";
import { useWorkCenterStats } from "@/pages/master/workcenters/model/useWorkCenterStats";
import { createKeyRecord } from "@/shared/lib/utils";
import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
} from "@/shared/ui";

export const WorkCenterMaster = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Pagination 처리를 위한 커스텀 훅
  const { page, size, onPageChange, onSizeChange } = usePaginationTable({});

  const { data, isLoading, isError, refetch } = useWorkCentersQuery({
    query: searchTerm === "" ? undefined : searchTerm,
    type: typeFilter === "" ? undefined : (typeFilter as WorkCenterType),
    status:
      statusFilter === "" ? undefined : (statusFilter as WorkCenterStatus),
    page,
    size,
  });

  const totalElements = data?.data?.totalElements ?? 0;
  const totalPages = data?.data?.totalPages ?? 0;

  const typeOptions = [
    { value: "", label: "전체 유형" },
    ...Object.entries(WORK_CENTER_TYPE)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => ({
        value: value as string,
        label: key === "INTERNAL" ? "내부 설비" : "외주 가공처",
      })),
  ];

  const statusOptions = [
    { value: "", label: "전체 상태" },
    ...Object.entries(WORK_CENTER_STATUS)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const statusLabels: Record<string, string> = {
          ACTIVE: "가동",
          INACTIVE: "중단",
          MAINTENANCE: "정비",
        };
        return {
          value: value as string,
          label: statusLabels[key] || key,
        };
      }),
  ];

  const handleCreateNew = () => {
    navigate("/master/workcenters/process");
  };

  const handleViewDetail = (row: WorkCenterResponseDTO) => {
    navigate(`/master/workcenters/process/${row.id}`, {
      state: { workCenterData: row },
    });
  };

  const keys = createKeyRecord<WorkCenterResponseDTO>(
    data?.data?.content ?? [],
  );

  const columns = [
    { key: keys.code, title: "작업장 코드", width: "120px" },
    { key: keys.name, title: "작업장명" },
    {
      key: keys.type,
      title: "유형",
      width: "120px",
      render: (value: string) => {
        const typeLabels: Record<string, string> = {
          INTERNAL: "내부 설비",
          EXTERNAL: "외주 가공처",
        };
        return (
          <Badge variant={value === "INTERNAL" ? "default" : "warning"}>
            {typeLabels[value] || value}
          </Badge>
        );
      },
    },
    {
      key: keys.dailyOperatingHours,
      title: "일일 가용시간",
      width: "120px",
      render: (value: number) => `${value || 0}시간`,
    },
    {
      key: keys.efficiency,
      title: "효율",
      width: "80px",
      render: (value: number) => `${value || 0}%`,
    },
    {
      key: keys.costPerHour,
      title: "시간당 비용",
      width: "120px",
      render: (value: number) =>
        value ? `₩${Number(value).toLocaleString()}` : "-",
    },
    {
      key: keys.status,
      title: "상태",
      width: "80px",
      render: (value: string) => {
        const statusLabels: Record<string, string> = {
          ACTIVE: "가동",
          INACTIVE: "중단",
          MAINTENANCE: "정비",
        };
        const getStatusVariant = (
          status: string,
        ): "success" | "default" | "error" | "warning" => {
          switch (status) {
            case "ACTIVE":
              return "success";
            case "INACTIVE":
              return "default";
            case "MAINTENANCE":
              return "warning";
            default:
              return "default";
          }
        };
        return (
          <Badge variant={getStatusVariant(value)}>
            {statusLabels[value] || value}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      title: "작업",
      width: "120px",
      render: (_value: any, row: WorkCenterResponseDTO) => {
        return (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetail(row)}
          >
            <i className="ri-edit-line mr-1"></i>
            편집
          </Button>
        );
      },
    },
  ];

  // 통계 계산 (API 데이터 기반)
  const workCenters = data?.data?.content ?? [];
  const {
    totalWorkCenters,
    activeWorkCenters,
    internalWorkCenters,
    externalWorkCenters,
    totalCapacity,
    avgHourlyRate,
  } = useWorkCenterStats(workCenters);

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

      {/* 작업장 능력 관리 안내 */}
      <InfoBox type="info" title="작업장 능력 관리 안내">
        <div className="flex items-center justify-around">
          <div className="flex-1">
            <p className="mb-1">
              • <strong>가용 능력:</strong> 일일 최대 가동 시간 × 효율(%) = 실제
              생산 가능 시간
            </p>
            <p className="mb-1">
              • <strong>시간당 비용:</strong> 노무비 + 제조경비 + 설비
              감가상각비 포함
            </p>
            <p>
              • <strong>생산 스케줄링:</strong> 각 작업장의 능력을 기반으로 최적
              일정 계획 수립
            </p>
          </div>

          <div className="ml-4 flex space-x-3">
            <Button variant="default" onClick={handleCreateNew}>
              <i className="ri-add-line mr-2"></i>
              신규 등록
            </Button>
          </div>
        </div>
      </InfoBox>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          onPageChange(0);
        }}
        searchPlaceholder="작업장명 또는 코드 검색..."
        filters={[
          {
            key: "type",
            value: typeFilter,
            options: typeOptions,
            onChange: (e) => {
              setTypeFilter(e);
              onPageChange(0);
            },
          },
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: (e) => {
              setStatusFilter(e);
              onPageChange(0);
            },
          },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("");
                setStatusFilter("");
                onPageChange(0);
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
          </>
        }
      />

      {/* 작업장 목록 테이블 */}
      <PaginationTableSection
        title="작업장 목록"
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
          data={workCenters}
          loading={isLoading && data === undefined}
          emptyText={
            isLoading && data === undefined
              ? "데이터 로딩 중..."
              : "조건에 맞는 작업장이 없습니다"
          }
          errorText={isError ? "데이터 로딩 중 오류가 발생했습니다." : ""}
        />
      </PaginationTableSection>
    </>
  );
};
