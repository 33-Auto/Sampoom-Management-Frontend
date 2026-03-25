import type { PartnerStatus } from "@/entities/partner";
import { PARTNER_STATUS } from "@/entities/partner";

const STATUS_LABELS: Record<PartnerStatus, string> = {
  ACTIVE: "활성",
  INACTIVE: "비활성",
};

export const formatPartnerStatus = (value?: PartnerStatus | null) => {
  if (!value) return "-";
  return STATUS_LABELS[value] ?? value;
};

export const getPartnerStatusVariant = (
  value?: PartnerStatus | null,
): "success" | "default" => {
  return value === "ACTIVE" ? "success" : "default";
};

export const buildPartnerStatusOptions = () => [
  { value: "", label: "전체 상태" },
  ...Object.entries(PARTNER_STATUS)
    .filter(([, value]) => value !== undefined)
    .map(([, value]) => ({
      value: value as string,
      label: formatPartnerStatus(value as PartnerStatus),
    })),
];
