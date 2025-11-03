import React from "react";

interface InfoBoxProps {
  type?: "info" | "success" | "warning" | "error";
  title: string;
  children: React.ReactNode;
}

const typeStyles = {
  info: {
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-200",
    contentColor: "text-blue-800 dark:text-blue-300",
    icon: "ri-information-line",
  },
  success: {
    border: "border-green-200 dark:border-green-800",
    bg: "bg-green-50 dark:bg-green-900/20",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-900 dark:text-green-200",
    contentColor: "text-green-800 dark:text-green-300",
    icon: "ri-check-line",
  },
  warning: {
    border: "border-yellow-200 dark:border-yellow-800",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    titleColor: "text-yellow-900 dark:text-yellow-200",
    contentColor: "text-yellow-800 dark:text-yellow-300",
    icon: "ri-alert-line",
  },
  error: {
    border: "border-red-200 dark:border-red-800",
    bg: "bg-red-50 dark:bg-red-900/20",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-900 dark:text-red-200",
    contentColor: "text-red-800 dark:text-red-300",
    icon: "ri-error-warning-line",
  },
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  type = "info",
  title,
  children,
}) => {
  const styles = typeStyles[type];

  return (
    <div className={`mb-6 rounded-lg border ${styles.border} ${styles.bg} p-4`}>
      <div className="flex items-start">
        <div
          className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${styles.iconBg}`}
        >
          <i className={`${styles.icon} text-sm ${styles.iconColor}`}></i>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${styles.titleColor}`}>
            {title}
          </h3>
          <div className={`mt-2 text-sm ${styles.contentColor}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
