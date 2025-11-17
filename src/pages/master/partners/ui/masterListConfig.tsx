import type { MasterListFilter } from "@/features/master-list";
import { Badge, Button } from "@/shared/ui";
import type { Column } from "@/shared/ui/Table/Table";

import {
  buildPartnerStatusOptions,
  formatPartnerStatus,
  getPartnerStatusVariant,
} from "../lib/formatters";
import type { PartnerResponseDTO, PartnerStatus } from "../model";

interface PartnerColumnsParams {
  keys: Record<keyof PartnerResponseDTO, keyof PartnerResponseDTO>;
  onEdit: (row: PartnerResponseDTO) => void;
}

interface PartnerFiltersParams {
  statusValue: string;
  onStatusChange: (value: string) => void;
}

export const createPartnerFilters = ({
  statusValue,
  onStatusChange,
}: PartnerFiltersParams): MasterListFilter[] => [
  {
    key: "status",
    value: statusValue,
    options: buildPartnerStatusOptions(),
    onChange: onStatusChange,
  },
];

export const createPartnerColumns = ({
  keys,
  onEdit,
}: PartnerColumnsParams): Column[] => [
  { key: keys.vendorCode, title: "거래처 코드", width: "120px" },
  { key: keys.name, title: "거래처명" },
  { key: keys.businessNumber, title: "사업자번호", width: "130px" },
  { key: keys.ceoName, title: "대표자", width: "100px" },
  { key: keys.address, title: "주소" },
  {
    key: keys.status,
    title: "상태",
    width: "80px",
    render: (value: string) => {
      const typedValue = value as PartnerStatus | null | undefined;
      return (
        <Badge variant={getPartnerStatusVariant(typedValue)}>
          {formatPartnerStatus(typedValue)}
        </Badge>
      );
    },
  },
  {
    key: "actions",
    title: "작업",
    width: "120px",
    render: (_value: any, row: PartnerResponseDTO) => (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onEdit(row)}
        aria-label="거래처 편집"
      >
        <i className="ri-edit-line mr-1"></i>
        편집
      </Button>
    ),
  },
];
