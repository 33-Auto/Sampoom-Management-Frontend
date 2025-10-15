import React from "react";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  /** Tailwind CSS background color class (e.g., "bg-main-100", "bg-blue-100") */
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  iconBgColor = "bg-main-100",
  iconColor = "text-main-600",
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-bg-card-white p-6 shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
      <div className="flex items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor}`}
        >
          <i className={`${icon} text-xl ${iconColor}`}></i>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};
