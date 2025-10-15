import type { PropsWithChildren } from "react";import React from "react";

import { ModuleHeader, NavigationTabs } from "@/widgets/Header";export interface NavItem {
  path: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface ModuleLayoutProps extends PropsWithChildren {
  moduleTitle: string;
  moduleDescription: string;
  moduleIcon: string;
  moduleColor: string;
  navItems: NavItem[];
}

const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  children,
  moduleTitle,
  moduleDescription,
  moduleIcon,
  moduleColor,
  navItems,
}) => {
  const headerConfig = {
    moduleTitle,
    moduleDescription,
    moduleIcon,
    moduleColor,
    navItems: [],
  };

  return (
    <div className="min-h-screen bg-bg-white dark:bg-bg-black">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor={moduleColor} />
      {children}
    </div>
  );
};

export { ModuleLayout, type ModuleLayoutProps };
