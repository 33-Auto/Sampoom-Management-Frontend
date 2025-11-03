import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@/shared/lib";

const infoBoxContainerVariants = cva("mb-6 rounded-lg border p-4", {
  variants: {
    type: {
      info: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
      success:
        "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
      warning:
        "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20",
      error: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

const infoBoxIconContainerVariants = cva(
  "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full",
  {
    variants: {
      type: {
        info: "bg-blue-100 dark:bg-blue-900/40",
        success: "bg-green-100 dark:bg-green-900/40",
        warning: "bg-yellow-100 dark:bg-yellow-900/40",
        error: "bg-red-100 dark:bg-red-900/40",
      },
    },
    defaultVariants: {
      type: "info",
    },
  },
);

const infoBoxIconVariants = cva("text-sm", {
  variants: {
    type: {
      info: "ri-information-line text-blue-600 dark:text-blue-400",
      success: "ri-check-line text-green-600 dark:text-green-400",
      warning: "ri-alert-line text-yellow-600 dark:text-yellow-400",
      error: "ri-error-warning-line text-red-600 dark:text-red-400",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

const infoBoxTitleVariants = cva("text-sm font-medium", {
  variants: {
    type: {
      info: "text-blue-900 dark:text-blue-200",
      success: "text-green-900 dark:text-green-200",
      warning: "text-yellow-900 dark:text-yellow-200",
      error: "text-red-900 dark:text-red-200",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

const infoBoxContentVariants = cva("mt-2 text-sm", {
  variants: {
    type: {
      info: "text-blue-800 dark:text-blue-300",
      success: "text-green-800 dark:text-green-300",
      warning: "text-yellow-800 dark:text-yellow-300",
      error: "text-red-800 dark:text-red-300",
    },
  },
  defaultVariants: {
    type: "info",
  },
});

export interface InfoBoxProps
  extends VariantProps<typeof infoBoxContainerVariants> {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  type = "info",
  title,
  children,
  className,
}) => {
  return (
    <div className={cn(infoBoxContainerVariants({ type }), className)}>
      <div className="flex items-start">
        <div className={cn(infoBoxIconContainerVariants({ type }))}>
          <i className={cn(infoBoxIconVariants({ type }))}></i>
        </div>
        <div className="ml-3 w-full">
          <h3 className={cn(infoBoxTitleVariants({ type }))}>{title}</h3>
          <div className={cn(infoBoxContentVariants({ type }))}>{children}</div>
        </div>
      </div>
    </div>
  );
};
