import React, { useEffect } from "react";
import { RouterProvider } from "react-router";

import ErrorBoundary from "@/app/providers/ErrorBoundary";
import router from "@/app/providers/router";
import { useAuthStore } from "@/entities/user/model/auth.store";

const App: React.FC = () => {
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
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
App.displayName = "App";
export default App;
