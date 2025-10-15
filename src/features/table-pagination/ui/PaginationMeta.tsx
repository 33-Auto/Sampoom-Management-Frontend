import React from "react";

interface PaginationMetaProps {
  totalElements: number;
  page: number;
  totalPages: number;
  size: number;
  sizeOptions?: number[];
  // 호출되는 함수를 넘겨줌
  onSizeChange: (size: number) => void;
}

export const PaginationMeta: React.FC<PaginationMetaProps> = ({
  totalElements,
  page,
  totalPages,
  size,
  sizeOptions = [10, 20, 50],
  onSizeChange,
}) => {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <span>
        총 {totalElements}개 / 페이지 {page + 1} / {Math.max(totalPages, 1)}
      </span>
      <select
        className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-xs"
        value={size}
        // 선택이 되면 부모에서 넘겨준 함수를 호출
        onChange={(e) => onSizeChange(Number(e.target.value))}
      >
        {sizeOptions.map((s) => (
          <option key={s} value={s}>
            {s}/page
          </option>
        ))}
      </select>
    </div>
  );
};
