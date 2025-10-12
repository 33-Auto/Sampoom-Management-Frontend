import React from "react";
import { Outlet } from "react-router-dom";import { ModuleHeader, NavigationTabs } from "@/widgets/Header";const MasterLayout: React.FC = () => {
  const headerConfig = {
    moduleTitle: "기준정보 관리",
    moduleDescription:
      "품목, BOM, 거래처, 작업장, 공정 등 기준 정보를 관리합니다",
    moduleIcon: "ri-database-line",
    moduleColor: "bg-blue-500",
    navItems: [],
  };

  const navItems = [
    { path: "/master/items", label: "품목 마스터", icon: "ri-database-line" },
    { path: "/master/bom", label: "BOM 관리", icon: "ri-file-list-3-line" },
    {
      path: "/master/partners",
      label: "거래처 마스터",
      icon: "ri-building-line",
    },
    {
      path: "/master/branches",
      label: "지점 마스터",
      icon: "ri-store-line",
    },
    {
      path: "/master/workcenters",
      label: "작업장 마스터",
      icon: "ri-tools-line",
    },
    { path: "/master/routings", label: "공정 마스터", icon: "ri-route-line" },
  ];

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-blue-500" />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default MasterLayout;
