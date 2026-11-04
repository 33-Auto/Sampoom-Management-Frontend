import React from "react";
import { Outlet } from "react-router-dom";

import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const PurchasingLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "구매 관리",
    moduleDescription: "생산에 필요한 원자재 구매 요청을 관리합니다",
    moduleIcon: "ri-shopping-bag-line",
    moduleColor: "bg-red-600",
    navItems: [],
  };

  const navItems = [
    {
      path: "/purchasing/requests",
      label: "구매 요청",
      icon: "ri-file-add-line",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-red-600" />
      <div className="p-4 sm:p-6 max-sm:[&>.max-w-7xl]:px-0">
        <Outlet />
      </div>
    </div>
  );
};

export default PurchasingLayout;
