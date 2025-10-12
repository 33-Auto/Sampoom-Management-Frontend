import React from "react";

interface TableSectionProps {
  title?: React.ReactNode;
  metaRight?: React.ReactNode;
  actionsRight?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const TableSection: React.FC<TableSectionProps> = ({
  title,
  metaRight,
  actionsRight,
  children,
  className = "",
}) => {
  const hasHeader = Boolean(title || metaRight || actionsRight);

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-bg-card-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black ${className}`}
    >
      {hasHeader && (
        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {title}
                </h2>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {metaRight}
              {actionsRight}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
