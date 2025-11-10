import React from "react";
import { Outlet } from "react-router-dom";

import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const PurchasingLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "구매 관리",
    moduleDescription: "구매 요청 및 발주 관리를 수행합니다",
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
    {
      path: "/purchasing/orders",
      label: "구매 주문",
      icon: "ri-file-check-line",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-red-600" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default PurchasingLayout;
