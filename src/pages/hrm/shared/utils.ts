export const departmentOptions = [
  { value: "all", label: "전체 부서" },
  { value: "development", label: "개발팀" },
  { value: "marketing", label: "마케팅팀" },
  { value: "sales", label: "영업팀" },
  { value: "hr", label: "인사팀" },
  { value: "finance", label: "재무팀" },
  { value: "design", label: "디자인팀" },
  { value: "quality", label: "품질관리팀" },
  { value: "cs", label: "고객서비스팀" },
];

export const getDepartmentText = (department: string): string => {
  switch (department) {
    case "development":
      return "개발팀";
    case "marketing":
      return "마케팅팀";
    case "sales":
      return "영업팀";
    case "hr":
      return "인사팀";
    case "finance":
      return "재무팀";
    case "design":
      return "디자인팀";
    case "quality":
      return "품질관리팀";
    case "cs":
      return "고객서비스팀";
    default:
      return department;
  }
};
