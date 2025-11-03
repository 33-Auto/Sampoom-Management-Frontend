import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

export const textareaVariants = cva(
  `focus:ring-opacity-50 w-full rounded-lg border bg-white px-3 py-2 text-sm text-grey-900 placeholder-grey-400 transition-all duration-200 focus:border-main-500 focus:ring-2 focus:ring-main-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-grey-100 dark:bg-bg-card-black dark:text-grey-100 dark:placeholder-grey-500 dark:disabled:bg-grey-800`,
  {
    variants: {
      variant: {
        primary:
          "border-grey-300 focus:border-main-500 focus:ring-main-500 dark:border-grey-700",

        secondary:
          "border-grey-300 focus:border-green-500 focus:ring-green-500 dark:border-grey-700",
      },

      error: {
        true: "border-error-red focus:border-error-red focus:ring-error-red",
        false:
          "border-grey-300 focus:border-main-500 focus:ring-main-500 dark:border-grey-600",
      },

      defaultVariants: {
        variant: "primary",
      },
    },
  },
);

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  errorText?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant, label, error, errorText, helperText, id, ...props }, ref) => {
    const reactId = React.useId();
    const textareaId = id || reactId;
    const hasError = !!errorText;

    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-1 block text-sm font-medium text-grey-700 dark:text-grey-300"
            htmlFor={textareaId}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={textareaVariants({ variant, error: hasError || error })}
          {...props}
        />

        {errorText && (
          <p className="mt-1 text-sm text-error-red">{errorText}</p>
        )}

        {helperText && !errorText && (
          <p className="mt-1 text-sm text-grey-500 dark:text-grey-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
