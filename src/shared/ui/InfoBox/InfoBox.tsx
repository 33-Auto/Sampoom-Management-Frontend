import React from "react";

interface InfoBoxProps {
  type?: "info" | "success" | "warning" | "error";
  title: string;
  children: React.ReactNode;
}

const typeStyles = {
  info: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    contentColor: "text-blue-800",
    icon: "ri-information-line",
  },
  success: {
    border: "border-green-200",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    titleColor: "text-green-900",
    contentColor: "text-green-800",
    icon: "ri-check-line",
  },
  warning: {
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-900",
    contentColor: "text-yellow-800",
    icon: "ri-alert-line",
  },
  error: {
    border: "border-red-200",
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    titleColor: "text-red-900",
    contentColor: "text-red-800",
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
