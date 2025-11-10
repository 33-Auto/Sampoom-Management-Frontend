import React, { useEffect } from "react";

import { useAgencyBranchOptions } from "@/entities/agency";
import { useFactoryBranchOptions } from "@/entities/factory";
import { useWmsBranchOptions } from "@/entities/wms";
import { cn } from "@/shared/lib";
import { Select, type Option } from "@/shared/ui/Select/Select";

import { useBranchSelectionStore } from "../model/branch-selection.store";

export type BranchModuleType = "agency" | "wms" | "factory";

const moduleConfig: Record<
  BranchModuleType,
  {
    hook: () => Option[];
    label: string;
    icon: string;
  }
> = {
  agency: {
    hook: useAgencyBranchOptions,
    label: "지점 선택",
    icon: "ri-building-line",
  },
  wms: {
    hook: useWmsBranchOptions,
    label: "지점 선택",
    icon: "ri-building-line",
  },
  factory: {
    hook: useFactoryBranchOptions,
    label: "공장 선택",
    icon: "ri-building-line",
  },
};

export interface BranchSelectProps {
  moduleType: BranchModuleType;
  label?: string;
  iconClassName?: string;
  className?: string;
  selectClassName?: string;
  spanClassName?: string;
  onBranchChange?: (value: string) => void;
}

export const BranchSelect: React.FC<BranchSelectProps> = ({
  moduleType,
  label,
  iconClassName,
  className,
  selectClassName,
  spanClassName,
  onBranchChange,
}) => {
  const { hook, label: defaultLabel, icon } = moduleConfig[moduleType];
  const options = hook();

  const branchId = useBranchSelectionStore(
    (state) => state.selections[moduleType],
  );
  const setBranchId = useBranchSelectionStore((state) => state.setSelection);

  useEffect(() => {
    if (!options.length) return;
    const firstValidOption = options.find((option) => option.value);
    if (!firstValidOption) return;
    const existsInOptions = options.some(
      (option) => option.value === branchId && !!option.value,
    );
    if (!branchId || !existsInOptions) {
      setBranchId(moduleType, firstValidOption.value);
      onBranchChange?.(firstValidOption.value);
    }
  }, [branchId, moduleType, onBranchChange, options, setBranchId]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value;
    setBranchId(moduleType, nextValue);
    onBranchChange?.(nextValue);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <i className={cn("text-gray-600", icon, iconClassName)} />
      <span
        className={cn(
          "text-sm font-medium whitespace-nowrap text-gray-700",
          spanClassName,
        )}
      >
        {label ?? defaultLabel}
      </span>
      <div className="max-w-xs min-w-0 flex-1">
        <Select
          options={options}
          value={branchId ?? ""}
          onChange={handleChange}
          className={cn("w-fit pr-8 text-sm", selectClassName)}
        />
      </div>
    </div>
  );
};
