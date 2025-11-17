export const buildDepartmentStatusOptions = () => [
  { value: "전체", label: "전체 상태" },
  { value: "활성", label: "활성" },
  { value: "비활성", label: "비활성" },
];

export const formatDepartmentHeadcount = (value: number) => `${value}명`;

export const formatDepartmentBudget = (value: number) =>
  `₩${(value / 100000000).toFixed(1)}억`;

export const getDepartmentStatusVariant = (value: string) =>
  value === "활성" ? "success" : "error";
