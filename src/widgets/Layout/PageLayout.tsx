import type { PropsWithChildren } from "react";
import React from "react";

import { Sidebar } from "@/widgets/Sidebar";

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
}

interface PageLayoutProps extends PropsWithChildren {
  sidebarItems: SidebarItem[];
  userRole: "Factory Manager" | "Warehouse Manager";
  pageTitle: string;
  pageDescription?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  sidebarItems,
  userRole,
  pageTitle,
  pageDescription,
}) => {
  return (
    <div className="flex min-h-screen bg-bg-white transition-colors duration-200 dark:bg-bg-black">
      <Sidebar items={sidebarItems} userRole={userRole} />

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-grey-500 dark:text-grey-100">
            {pageTitle}
          </h1>
          {pageDescription && (
            <p className="text-grey-400 dark:text-grey-300">
              {pageDescription}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export { PageLayout, type PageLayoutProps, type SidebarItem };
