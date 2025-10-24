import { Navigate } from "react-router-dom";

import { Button } from "@/shared/ui";

type ErrorHandlerProps = {
  error: Error;
  resetErrorBoundary?: (...args: any[]) => void;
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
  const { error, resetErrorBoundary } = props;

  if ((error as any)?.response?.status === 404) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bg-white px-4 text-center dark:bg-bg-black">
      <h1 className="text-5xl font-semibold text-gray-400 md:text-6xl">오류</h1>
      <h2 className="mt-6 text-2xl font-semibold md:text-3xl dark:text-gray-200">
        뭔가 잘못되었습니다.
      </h2>

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
        <Button type="button" onClick={() => (window.location.href = "/")}>
          홈으로
        </Button>
      </div>
    </div>
  );
};

export { ErrorHandler };
