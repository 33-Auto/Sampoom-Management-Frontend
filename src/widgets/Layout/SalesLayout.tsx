import React from "react";
import { Outlet } from "react-router-dom";import { BranchSelectBar } from "@/features/branch-select";import { ModuleHeader, NavigationTabs } from "@/widgets/Header";const SalesLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "판매 관리",
    moduleDescription: "대리점 주문 접수 및 판매 현황을 관리합니다",
    moduleIcon: "ri-shopping-cart-line",
    moduleColor: "bg-green-600",
    navItems: [],
  };

  const navItems = [
    { path: "/sales/orders", label: "판매 주문", icon: "ri-file-list-line" },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-green-600" />
      {/* 지점 선택 영역 */}
      <BranchSelectBar moduleType="wms" />
      <Outlet />
    </div>
  );
};

export default SalesLayout;
