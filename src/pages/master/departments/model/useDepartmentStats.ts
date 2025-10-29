import { useMemo } from "react";

interface DepartmentData {
  status: string;
  employeeCount: number;
  budget: number;
}

export const useDepartmentStats = (data: DepartmentData[]) => {
  return useMemo(() => {
    const totalDepts = data.length;
    const activeDepts = data.filter((dept) => dept.status === "활성").length;
    const totalEmployees = data.reduce(
      (sum, dept) => sum + dept.employeeCount,
      0,
    );
    const totalBudget = data.reduce((sum, dept) => sum + dept.budget, 0);

    return {
      totalDepts,
      activeDepts,
      totalEmployees,
      totalBudget,
    };
  }, [data]);
};
