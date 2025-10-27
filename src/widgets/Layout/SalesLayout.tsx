import React from "react";
import { Outlet } from "react-router-dom";
import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const SalesLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "판매 관리",
    moduleDescription: "대리점 주문 접수 및 판매 현황을 관리합니다",
    moduleIcon: "ri-shopping-cart-line",
    moduleColor: "bg-green-600",
    userRole: "판매 관리자",
    userEmail: "sales@company.com",
    navItems: []
  };

  const navItems = [
    { path: "/sales/orders", label: "판매 주문", icon: "ri-file-list-line" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-green-600" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SalesLayout;

