import React from "react";
import { Outlet } from "react-router-dom";

import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const WMSLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "재고 관리 (WMS)",
    moduleDescription: "창고 출고 지시 및 재고 현황을 관리합니다",
    moduleIcon: "ri-archive-drawer-line",
    moduleColor: "bg-purple-600",
    userRole: "창고 관리자",
    userEmail: "warehouse@company.com",
    navItems: [],
  };

  const navItems = [
    { path: "/wms/shipping", label: "출고 지시", icon: "ri-truck-line" },
    {
      path: "/wms/inventory",
      label: "재고 현황",
      icon: "ri-bar-chart-box-line",
    },
    { path: "/wms/receiving", label: "입고 관리", icon: "ri-file-list-3-line" },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-purple-600" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default WMSLayout;
