import { cva } from "class-variance-authority";import React from "react";

import { cn } from "@/shared/lib";const toastVariants = cva(
  "animate-toast-enter flex max-w-[400px] min-w-[300px] items-start gap-3 rounded-lg border p-4 shadow-lg",
  {
    variants: {
      type: {
        success:
          "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200",
        error:
          "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200",
      },
      exiting: {
        true: "animate-toast-exit",
        false: "",
      },
    },
    defaultVariants: {
      exiting: false,
    },
  },
);

const iconMap = {
  success: "ri-check-line",
  error: "ri-error-warning-line",
  warning: "ri-alert-line",
  info: "ri-information-line",
};

interface ToastProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  onClose: () => void;
  exiting?: boolean;
}

export function Toast({ type, title, message, onClose, exiting }: ToastProps) {
  return (
    <div className={cn(toastVariants({ type, exiting }))} role="alert">
      <div className="shrink-0">
        <i className={cn("text-lg", iconMap[type])} />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 text-current opacity-50 transition-opacity hover:opacity-100"
        aria-label="닫기"
      >
        <i className="ri-close-line text-lg" />
      </button>
    </div>
  );
}
