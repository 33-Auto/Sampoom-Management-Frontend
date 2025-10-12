import { cva, type VariantProps } from "class-variance-authority";import type { HTMLAttributes } from "react";import * as React from "react";

import { cn } from "@/shared/lib";const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        success:
          "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
        warning:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
        error: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
        purple:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
        orange:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
