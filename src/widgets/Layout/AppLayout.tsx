import type { PropsWithChildren } from "react";
import React, { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { ThemeToggle } from "@/shared/ui";
import { Footer } from "@/widgets/Footer";

interface AppLayoutProps extends PropsWithChildren {
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
      <main className="flex-1">{children || <Outlet />}</main>
      {/* 화면 아래에 붙어 있다가 푸터가 올라오면 푸터 위에 멈춘다 (fixed는 푸터를 덮었다) */}
      <div className="pointer-events-none sticky bottom-4 z-40 h-0">
        <ThemeToggle className="pointer-events-auto absolute bottom-0 left-4" />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
