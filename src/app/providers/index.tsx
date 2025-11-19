import React from "react";
import ReactDOM from "react-dom/client";

import "@/app/styles/global.css";

import { NotificationProvider } from "./NotificationContext";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}
const root = ReactDOM.createRoot(rootElement);

// MSW 준비 상태를 추적하는 Promise
let mswReadyPromise: Promise<void> | null = null;

const initMSW = async (): Promise<void> => {
  // 이미 Promise가 있으면 기존 Promise를 반환
  if (mswReadyPromise) {
    return mswReadyPromise;
  }

  // 동적 import를 통해서 mock/browser.js 파일을 임포트
  mswReadyPromise = import("./mocks/browser")
    .then(async ({ worker }) => {
      await worker.start({
        onUnhandledRequest: "bypass",
      });
      console.log("Mock Service Worker has started.");
    })
    .catch((error) => {
      console.error("Failed to start MSW:", error);
      throw error;
    });

  // promise를 반환
  // 이 promise가 완료되면 MSW가 준비된 것으로 간주
  return mswReadyPromise;
};

const renderApp = async () => {
  // MSW(Mock Service Worker) 활성화 여부를 환경 변수로 제어 한다.
  // VITE_USE_MOCK=true로 설정하면 MSW가 활성화
  const shouldUseMock =
    // import.meta.env.DEV && // vercl 설정상 Vite의 빌드 시점에서 false로 치환됨 그래서 주석처리
    import.meta.env.VITE_USE_MOCK === "true";

  // MSW가 필요한 경우 완전히 시작될 때까지 기다립니다.
  if (shouldUseMock) {
    try {
      // promise가 완료 될 때까지 기다린다
      await initMSW();
    } catch (error) {
      console.error(
        "MSW initialization failed, continuing without mocks:",
        error,
      );
    }
  }

  // MSW 준비가 완료된 후 App을 동적으로 import하여 router가 생성되도록 한다.
  const { default: App } = await import("@/app/App");

  // MSW 준비가 완료된 후 앱을 렌더링합니다.
  root.render(
    <React.StrictMode>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </React.StrictMode>,
  );
};

// 앱 초기화 시작
renderApp();
