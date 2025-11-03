import * as React from "react";

import { cn } from "@/shared/lib";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-gray-200 bg-bg-card-white p-6 text-black shadow-sm dark:border-gray-700 dark:bg-bg-card-black dark:text-white",
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card };
