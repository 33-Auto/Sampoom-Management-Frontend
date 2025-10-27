import React from "react";
import { Outlet } from "react-router-dom";
import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

const MasterLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "기준정보 관리",
    moduleDescription: "품목, BOM, 거래처, 작업장, 공정 등 기준 정보를 관리합니다",
    moduleIcon: "ri-database-line",
    moduleColor: "bg-main-500",
    userRole: "시스템 관리자",
    userEmail: "admin@company.com",
    navItems: []
  };

  const navItems = [
    { path: "/master/items", label: "품목 마스터", icon: "ri-database-line" },
    { path: "/master/bom", label: "BOM 관리", icon: "ri-file-list-3-line" },
    { path: "/master/partners", label: "거래처 마스터", icon: "ri-building-line" },
    { path: "/master/workcenters", label: "작업장 마스터", icon: "ri-tools-line" },
    { path: "/master/routings", label: "공정 마스터", icon: "ri-route-line" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-main-500" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MasterLayout;
