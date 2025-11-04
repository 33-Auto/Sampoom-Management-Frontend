import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider } from "react-router";

import router from "@/app/providers/router";
import { useAuthStore } from "@/entities/user";
import { queryClient } from "@/shared/api/query";
import { useThemeStore } from "@/shared/lib";
import { ErrorHandler } from "@/shared/ui";

const App: React.FC = () => {
  const { theme } = useThemeStore();

  // 테마를 HTML 문서에 적용
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 인증 실패에 대한 전역 처리
  useEffect(() => {
    const handleAuthFailure = () => {
      useAuthStore.getState().logout();
    };

    window.addEventListener("auth:failed", handleAuthFailure);

    return () => {
      window.removeEventListener("auth:failed", handleAuthFailure);
    };
  }, []);

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorHandler}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ErrorBoundary>
      {!import.meta.env.DEV && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
};
App.displayName = "App";
export default App;
