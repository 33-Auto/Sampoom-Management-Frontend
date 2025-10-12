import React from "react";

import { Button } from "@/shared/ui";interface PaginationNavigationProps {
  page: number;
  totalPages: number;
  // 페이지 변경 시 호출되는 함수를 넘겨줌
  onPageChange: (page: number | ((prev: number) => number)) => void;
  showRefresh?: boolean;
  onRefresh?: () => void | Promise<any>;
}

export const PaginationNavigation: React.FC<PaginationNavigationProps> = ({
  page,
  totalPages,
  onPageChange,
  showRefresh = false,
  onRefresh,
}) => {
  const handlePrev = () => {
    onPageChange((p: number) => Math.max(0, p - 1)); // -1 인덱스 방어
  };

  const handleNext = () => {
    onPageChange((p: number) =>
      totalPages ? Math.min(totalPages - 1, p + 1) : p + 1,
    );
  };

  return (
    <div className="flex items-center gap-2">
      {showRefresh && onRefresh && (
        <Button variant="secondary" size="sm" onClick={onRefresh}>
          <i className="ri-refresh-line mr-2"></i>
          새로고침
        </Button>
      )}
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrev}
          disabled={page <= 0}
        >
          이전
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleNext}
          disabled={totalPages ? page >= totalPages - 1 : false}
        >
          다음
        </Button>
      </div>
    </div>
  );
};
