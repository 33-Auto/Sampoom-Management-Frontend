import React from "react";
import ReactDOM from "react-dom/client";

import "@/app/styles/global.css";
import App from "@/app/App";

import { NotificationProvider } from "./NotificationContext";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}
const root = ReactDOM.createRoot(rootElement);

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </React.StrictMode>,
  );
};

// 개발 환경에서만 MSW(Mock Service Worker)를 활성화합니다.
if (import.meta.env.DEV) {
  import("./mocks/browser")
    .then(({ worker }) => {
      worker.start();
    })
    .then(() => {
      console.log("Mock Service Worker has started.");
      renderApp();
    });
} else {
  // 프로덕션 환경에서는 MSW 없이 바로 앱을 렌더링합니다.
  renderApp();
}
