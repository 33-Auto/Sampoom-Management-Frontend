export const buildPositionCategoryOptions = () => [
  { value: "전체", label: "전체 구분" },
  { value: "임원", label: "임원" },
  { value: "관리직", label: "관리직" },
  { value: "일반직", label: "일반직" },
];

export const formatCurrency = (value: number) => `₩${value.toLocaleString()}`;

export const formatHeadcount = (value: number) => `${value}명`;

export const getPositionCategoryVariant = (value: string) => {
  if (value === "임원") return "purple";
  if (value === "관리직") return "success";
  return "default";
};

export const getPositionStatusVariant = (value: string) =>
  value === "활성" ? "success" : "error";
