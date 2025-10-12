import type { PropsWithChildren } from "react";import React, { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";import { ThemeToggle } from "@/shared/ui";import { Footer } from "@/widgets/Footer";interface AppLayoutProps extends PropsWithChildren {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  // 새로운 페이지를 로딩할 때 스크롤을 최상단으로 이동
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <ThemeToggle />
      <main className="flex-1">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default AppLayout;
