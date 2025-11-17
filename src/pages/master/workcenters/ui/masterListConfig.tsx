import type { MasterListFilter } from "@/features/master-list";
import { Badge, Button, InfoBox } from "@/shared/ui";
import type { Column } from "@/shared/ui/Table/Table";

import {
  buildWorkCenterStatusOptions,
  buildWorkCenterTypeOptions,
  formatCostPerHour,
  formatEfficiency,
  formatOperatingHours,
  formatWorkCenterStatus,
  formatWorkCenterType,
  getWorkCenterStatusVariant,
  getWorkCenterTypeBadgeVariant,
} from "../lib/formatters";
import type {
  WorkCenterResponseDTO,
  WorkCenterStatus,
  WorkCenterType,
} from "../model";

interface WorkCenterColumnsParams {
  keys: Record<keyof WorkCenterResponseDTO, keyof WorkCenterResponseDTO>;
  onEdit: (row: WorkCenterResponseDTO) => void;
}

interface WorkCenterFiltersParams {
  typeValue: string;
  statusValue: string;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const createWorkCenterFilters = ({
  typeValue,
  statusValue,
  onTypeChange,
  onStatusChange,
}: WorkCenterFiltersParams): MasterListFilter[] => [
  {
    key: "type",
    value: typeValue,
    options: buildWorkCenterTypeOptions(),
    onChange: onTypeChange,
  },
  {
    key: "status",
    value: statusValue,
    options: buildWorkCenterStatusOptions(),
    onChange: onStatusChange,
  },
];

export const createWorkCenterColumns = ({
  keys,
  onEdit,
}: WorkCenterColumnsParams): Column[] => [
  { key: keys.code, title: "작업장 코드", width: "120px" },
  { key: keys.name, title: "작업장명" },
  {
    key: keys.type,
    title: "유형",
    width: "120px",
    render: (value: string) => {
      const typedValue = value as WorkCenterType | null | undefined;
      return (
        <Badge variant={getWorkCenterTypeBadgeVariant(typedValue)}>
          {formatWorkCenterType(typedValue)}
        </Badge>
      );
    },
  },
  {
    key: keys.dailyOperatingHours,
    title: "일일 가용시간",
    width: "120px",
    render: (value: number) => formatOperatingHours(value),
  },
  {
    key: keys.efficiency,
    title: "효율",
    width: "80px",
    render: (value: number) => formatEfficiency(value),
  },
  {
    key: keys.costPerHour,
    title: "시간당 비용",
    width: "120px",
    render: (value: number) => formatCostPerHour(value),
  },
  {
    key: keys.status,
    title: "상태",
    width: "80px",
    render: (value: string) => {
      const typedValue = value as WorkCenterStatus | null | undefined;
      return (
        <Badge variant={getWorkCenterStatusVariant(typedValue)}>
          {formatWorkCenterStatus(typedValue)}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    title: "작업",
    width: "120px",
    render: (_value: any, row: WorkCenterResponseDTO) => (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onEdit(row)}
        aria-label="작업장 편집"
      >
        <i className="ri-edit-line mr-1"></i>
        편집
      </Button>
    ),
  },
];

interface WorkCenterInfoProps {
  onCreate: () => void;
}

export const WorkCenterCapacityInfo = ({ onCreate }: WorkCenterInfoProps) => (
  <InfoBox type="info" title="작업장 능력 관리 안내">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
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
      </div>

      <div className="flex justify-end">
        <Button variant="default" onClick={onCreate}>
          <i className="ri-add-line mr-2"></i>
          신규 등록
        </Button>
      </div>
    </div>
  </InfoBox>
);
