import type { PropsWithChildren } from "react";
import React from "react";

import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface ModuleLayoutProps extends PropsWithChildren {
  moduleTitle: string;
  moduleDescription: string;
  moduleIcon: string;
  moduleColor: string;
  userRole: string;
  userEmail: string;
  navItems: NavItem[];
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  children,
  moduleTitle,
  moduleDescription,
  moduleIcon,
  moduleColor,
  userRole,
  userEmail,
  navItems,
}) => {
  const headerConfig = {
    moduleTitle,
    moduleDescription,
    moduleIcon,
    moduleColor,
    userRole,
    userEmail,
    navItems: [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor={moduleColor} />
      {children}
    </div>
  );
};

export { ModuleLayout, type ModuleLayoutProps };
