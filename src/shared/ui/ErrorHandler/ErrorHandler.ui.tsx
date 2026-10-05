import type { ReactNode } from "react";
import { Navigate, useInRouterContext, useNavigate } from "react-router-dom";

import { Button } from "../Button";

type ErrorHandlerProps = {
  error: any;
  resetErrorBoundary: (...args: any[]) => void;
};

const isDev =
  (typeof process !== "undefined" &&
    (process as any).env &&
    (process as any).env.NODE_ENV === "development") ||
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env &&
    ((import.meta as any).env.MODE === "development" ||
      !!(import.meta as any).env.DEV));

const ErrorHandler = (props: ErrorHandlerProps) => {
  const isInsideRouter = useInRouterContext();

  // App's outer boundary can render after RouterProvider has unmounted.
  if (isInsideRouter) {
    return <RouterErrorHandler {...props} />;
  }

  return (
    <ErrorHandlerView
      {...props}
      homeAction={
        <Button asChild>
          <a href="/">홈으로</a>
        </Button>
      }
    />
  );
};

const RouterErrorHandler = (props: ErrorHandlerProps) => {
  const navigate = useNavigate();

  if (props.error?.status === 404) {
    return <Navigate to="/404" replace />;
  }

  return (
    <ErrorHandlerView
      {...props}
      homeAction={
        <Button
          type="button"
          onClick={() => {
            void navigate("/");
          }}
        >
          홈으로
        </Button>
      }
    />
  );
};

const ErrorHandlerView = ({
  error,
  resetErrorBoundary,
  homeAction,
}: ErrorHandlerProps & { homeAction: ReactNode }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg-white px-4 text-center dark:bg-bg-black">
      <h2 className="text-3xl font-semibold text-gray-400 md:text-6xl">오류</h2>

      <p className="mt-4 max-w-2xl text-gray-500">
        {error?.message || "알 수 없는 에러가 발생했습니다."}
      </p>

      {isDev && (
        <div className="mt-6 w-full max-w-3xl rounded border border-gray-200 bg-gray-50 p-4 text-left text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
          <strong>Stack trace</strong>
          <pre className="mt-2 wrap-break-word whitespace-pre-wrap">
            {error.stack}
          </pre>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Button type="button" onClick={resetErrorBoundary}>
          다시시도
        </Button>
        {homeAction}
      </div>
    </div>
  );
};

export { ErrorHandler };
