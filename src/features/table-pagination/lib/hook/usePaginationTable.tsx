/**
 * 페이지 네이션을 위한 훅을 정의합니다
 * 기존에 Props로 전달되던 Navigation과 Meta를 훅으로 처리할 예정
 */

/**
 *   // Pagination 처리를 위한 Props
  totalElements, // 상태 x<< 변하지 않음
  page, // 상태
  totalPages, // 상태 x<< 변하지 않음
  size, // 상태
  onSizeChange, // 함수
  onPageChange, // 함수 
 */

import { useState } from "react";

interface UsePaginationTableProps {
  page?: number;
  size?: number;
}
export function usePaginationTable({
  page: initialPage = 0,
  size: initialSize = 10,
}: UsePaginationTableProps) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const onSizeChange = (newSize: number) => {
    setSize(newSize);
    // 사이즈가 변한다면 페이지를 첫 페이지로 변경
    setPage(0);
  };

  return {
    page,
    size,
    setPage,
    setSize,
    onPageChange: setPage,
    onSizeChange,
  };
}
