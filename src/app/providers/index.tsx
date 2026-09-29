import React from "react";
import ReactDOM from "react-dom/client";

import "@/app/styles/global.css";

import { NotificationProvider } from "@/shared/lib";

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
        onUnhandledRequest(request, print) {
          // Vercel 관련 스크립트나 내부 요청은 조용히 넘김 (에러 로그 방지)
          if (
            request.url.includes("_vercel") ||
            request.url.includes("google-analytics") ||
            request.url.includes("pagespeed")
          ) {
            return;
          }
          print.warning();
        },
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
  // VITE_USE_MOCK=true이거나 특정 성능 테스트 경로인 경우 활성화
  const shouldUseMock =
    import.meta.env.VITE_USE_MOCK === "true" ||
    window.location.pathname.includes("/perf-stress-test");

  console.log(`[Init] shouldUseMock: ${shouldUseMock}`);

  if (shouldUseMock) {
    try {
      // MSW가 준비될 때까지 기다림
      await initMSW();
      console.log("[Init] MSW is ready. Proceeding with App rendering.");
    } catch (error) {
      console.error("[Init] MSW failed to start:", error);
    }
  }

  // **중요**: MSW 준비가 완료된 후 'App'과 그 하위 모듈들을 임포트하여
  // 모듈 초기화 시점에 발생하는 API 요청(싱글톤 생성 등)이 누락되지 않게 함.
  const { default: App } = await import("@/app/App");

  if (!rootElement) return;

  root.render(
    <React.StrictMode>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </React.StrictMode>,
  );
};

renderApp();
