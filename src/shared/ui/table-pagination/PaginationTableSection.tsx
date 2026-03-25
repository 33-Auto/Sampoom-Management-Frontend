import React from "react";

import { TableSection } from "../TableSection";

import { PaginationMeta } from "./PaginationMeta";
import { PaginationNavigation } from "./PaginationNavigation";

interface PaginationTableSectionProps {
  title?: React.ReactNode;
  totalElements: number;
  page: number;
  totalPages: number;
  size: number;
  onSizeChange: (size: number) => void;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  children: React.ReactNode;
  className?: string;
  showRefresh?: boolean;
  onRefresh?: () => void | Promise<any>;
  actionsRight?: React.ReactNode;
}

// 기존에 Table에서 받는 Props와 페이지 네이션에 필요한 Props를 모두 받는다
export const PaginationTableSection: React.FC<PaginationTableSectionProps> = ({
  title,
  // Pagination 처리를 위한 Props
  totalElements,
  page,
  totalPages,
  size,
  onSizeChange,
  onPageChange,
  // 기존 Table에서 받는 Props
  children,
  // className을 받아서 추가로 적용하기 위한 Props
  className = "",

  // 새로 고침을 위한 Props
  showRefresh = false,
  onRefresh,
  actionsRight,
}) => {
  const handleSizeChange = (newSize: number) => {
    onSizeChange(newSize);
    // size 변경 시 첫 페이지로 이동
    onPageChange(0);
  };

  return (
    <TableSection
      title={title}
      metaRight={
        <PaginationMeta
          totalElements={totalElements}
          page={page}
          totalPages={totalPages}
          size={size}
          onSizeChange={handleSizeChange}
        />
      }
      actionsRight={
        <div className="flex items-center gap-2">
          <PaginationNavigation
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            showRefresh={showRefresh}
            onRefresh={onRefresh}
          />
          {actionsRight}
        </div>
      }
      className={className}
    >
      {children}
    </TableSection>
  );
};
