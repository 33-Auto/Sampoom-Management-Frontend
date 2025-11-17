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

// MSW(Mock Service Worker) 활성화 여부를 환경 변수로 제어합니다.
// VITE_USE_MOCK=true로 설정하면 MSW가 활성화됩니다.
const shouldUseMock =
  // import.meta.env.DEV && // vercl 설정상 Vite의 빌드 시점에서 false로 치환됨 그래서 주석처리
  import.meta.env.VITE_USE_MOCK === "true";

if (shouldUseMock) {
  import("./mocks/browser")
    .then(({ worker }) => {
      worker.start();
    })
    .then(() => {
      console.log("Mock Service Worker has started.");
      renderApp();
    });
} else {
  // MSW 없이 바로 앱을 렌더링합니다.
  renderApp();
}
