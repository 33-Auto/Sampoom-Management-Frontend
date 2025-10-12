import React from "react";

import { cn } from "@/shared/lib";import { BranchSelect, type BranchSelectProps } from "./BranchSelect";export interface BranchSelectBarProps
  extends Pick<
    BranchSelectProps,
    | "moduleType"
    | "label"
    | "iconClassName"
    | "selectClassName"
    | "spanClassName"
    | "onBranchChange"
  > {
  containerClassName?: string;
  innerClassName?: string;
  contentClassName?: string;
}

export const BranchSelectBar: React.FC<BranchSelectBarProps> = ({
  containerClassName,
  innerClassName,
  contentClassName,
  ...branchSelectProps
}) => {
  return (
    <div
      className={cn(
        "border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-bg-card-black",
        containerClassName,
      )}
    >
      <div className={cn("mx-auto px-10 py-2", innerClassName)}>
        <div
          className={cn(
            "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
            contentClassName,
          )}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center">
            <BranchSelect {...branchSelectProps} />
          </div>
        </div>
      </div>
    </div>
  );
};
