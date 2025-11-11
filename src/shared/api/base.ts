import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "@/shared/model/v1";

const BASE_URL: string = import.meta.env.VITE_BASE_URL;

const applyDefaultHeaders = (request: Request) => {
  request.headers.set("Content-Type", "application/json");
  request.headers.set("X-Client-Type", "WEB");
};

const createAuthAwareFetchClient = () => {
  const fetchClient = createFetchClient<paths>({
    baseUrl: BASE_URL,
    credentials: "include",
  });

  console.log("API Client created with BASE_URL:", BASE_URL);

  let refreshPromise: Promise<Response> | null = null;

  fetchClient.use({
    async onRequest({ request }) {
      applyDefaultHeaders(request);
      return request;
    },
    async onResponse({ request, response }) {
      // 401이 아니면 그냥 리턴
      if (response.status !== 401) {
        return response;
      }

      // 리프레시 처리이면
      // 바로 응답
      if (request.url === `${BASE_URL}/api/auth/refresh`) {
        window.dispatchEvent(new Event("auth:failed"));
        return response;
      }

      // 401인데 리프레시 요청이 아닌경우엔
      // refreshPromise를 생성
      if (!refreshPromise) {
        // 리프레시 요청 생성
        const refreshRequest = new Request(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        applyDefaultHeaders(refreshRequest);

        // 리프레시 요청 실행
        refreshPromise = fetch(refreshRequest).finally(() => {
          // 리프레시 요청 완료 후 refreshPromise를 null로 초기화
          refreshPromise = null;
        });
      }

      try {
        const refreshRes = await refreshPromise;

        // 요청이 성공이면
        if (refreshRes.ok) {
          return fetch(request.clone());
        }

        throw new Error("리프레시 토큰 생성 실패");
      } catch (error) {
        console.error("토큰 리프레시 실패, 로그아웃 처리.", error);
        window.dispatchEvent(new Event("auth:failed"));
        return response;
      }
    },
  });

  return fetchClient;
};

export const fetchClient = createAuthAwareFetchClient();
export const queryClient = createClient(fetchClient);
