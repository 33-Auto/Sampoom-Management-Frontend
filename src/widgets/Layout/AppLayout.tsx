import type { PropsWithChildren } from "react";
import React from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "@/widgets/Footer";

interface AppLayoutProps extends PropsWithChildren {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-1">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
