import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib";

export const selectVariants = cva(
  `focus:ring-opacity-50 w-full appearance-none rounded-lg border bg-white px-3 py-2 text-sm text-grey-900 transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-grey-100 dark:bg-bg-card-black dark:text-white dark:disabled:bg-grey-900`,
  {
    variants: {
      error: {
        true: "border-error-red focus:border-error-red focus:ring-error-red",
      },
    },
  },
);

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  options?: Option[];
  label?: string;
  helperText?: string;
  errorText?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, errorText, helperText, className, options = [], ...props },
    ref,
  ) => {
    const hasError = !!errorText;
    // focus를 위한 ref 생성
    const reactId = React.useId();
    const selectId = reactId;

    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-2 block text-sm font-medium text-grey-700 dark:text-grey-300"
            htmlFor={selectId}
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          className={cn(className, selectVariants({ error: hasError }))}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {errorText && (
          <p className="mt-2 text-sm text-error-red">{errorText}</p>
        )}

        {helperText && !errorText && (
          <p className="mt-2 text-sm text-grey-500 dark:text-grey-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
