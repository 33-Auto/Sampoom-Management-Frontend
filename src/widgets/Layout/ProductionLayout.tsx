import React from "react";
import { Outlet } from "react-router-dom";
import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const ProductionLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "생산 관리",
    moduleDescription: "생산 지시 및 작업 현황을 관리합니다",
    moduleIcon: "ri-settings-4-line",
    moduleColor: "bg-orange-600",
    userRole: "생산 관리자",
    userEmail: "production@company.com",
    navItems: []
  };

  const navItems = [
    { path: "/production/orders", label: "생산 지시", icon: "ri-hammer-line" },
    { path: "/production/planning", label: "생산 계획", icon: "ri-calendar-line" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-orange-600" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ProductionLayout;


