import React from "react";
import { Outlet } from "react-router-dom";

import { BranchSelectBar } from "@/features/branch-select";
import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const ProductionLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "생산 관리",
    moduleDescription: "생산 지시 및 작업 현황을 관리합니다",
    moduleIcon: "ri-settings-4-line",
    moduleColor: "bg-orange-600",
    navItems: [],
  };

  const navItems = [
    {
      path: "/production/orders",
      label: "생산 지시(MES)",
      icon: "ri-hammer-line",
    },
    {
      path: "/production/planning",
      label: "생산 계획(MRP)",
      icon: "ri-calendar-line",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-orange-600" />
      {/* 지점 선택 영역 */}
      <BranchSelectBar moduleType="factory" />
      <Outlet />
    </div>
  );
};

export default ProductionLayout;
