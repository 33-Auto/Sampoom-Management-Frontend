import React from "react";
import { Outlet } from "react-router-dom";
import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const HRMLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "인사 관리 (HRM)",
    moduleDescription: "직원 정보, 급여, 근태 및 평가 관리를 수행합니다",
    moduleIcon: "ri-team-line",
    moduleColor: "bg-teal-600",
    userRole: "인사 담당자",
    userEmail: "hr@company.com",
    navItems: []
  };

  const navItems = [
    { path: "/hrm/employees", label: "직원 관리", icon: "ri-user-line" },
    { path: "/hrm/payroll", label: "급여 관리", icon: "ri-money-dollar-circle-line" },
    { path: "/hrm/attendance", label: "근태 관리", icon: "ri-time-line" },
    { path: "/hrm/evaluation", label: "평가 관리", icon: "ri-star-line" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-teal-600" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default HRMLayout;

