import { HttpResponse } from "msw";// API 성공 응답 헬퍼 코드
export function apiSuccess<T>(data: T, status = 200, message = "Success") {
  return HttpResponse.json(
    {
      status,
      success: true,
      message,
      data,
    },
    { status },
  );
}

// API 실패 응답 헬퍼 코드
export function apiFail(status = 500, message = "Internal Server Error") {
  return HttpResponse.json(
    {
      status,
      success: false,
      code: 50000,
      message,
      data: null,
    },
    { status },
  );
}

export const sleep = async (ms: number): Promise<void> => {
  // 성능 측정 모드에서는 딜레이 없이 바로 반환
  if (import.meta.env.VITE_PERF_MODE === "true") return;
  return new Promise((resolve) => setTimeout(resolve, ms));
};
