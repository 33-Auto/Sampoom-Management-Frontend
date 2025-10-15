import React from "react";
import { Outlet } from "react-router-dom";import { ModuleHeader, NavigationTabs } from "@/widgets/Header";const HRMLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "인사 관리 (HRM)",
    moduleDescription: "직원 정보를 조회합니다",
    moduleIcon: "ri-team-line",
    moduleColor: "bg-teal-600",
    navItems: [],
  };

  const navItems = [
    { path: "/hrm/employees", label: "직원 관리", icon: "ri-user-line" },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-teal-600" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default HRMLayout;
