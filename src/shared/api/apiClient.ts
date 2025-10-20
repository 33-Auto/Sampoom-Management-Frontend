import createClient from "openapi-fetch";

import type { paths } from "@/shared/api/v1";

const BASE_URL = "https://sampoom.store";

export const createApiClient = () => {
  const client = createClient<paths>({
    baseUrl: BASE_URL,
    credentials: "include",
  });

  let refreshPromise: Promise<Response> | null = null;

  client.use({
    async onRequest({ request }) {
      request.headers.set("Content-Type", "application/json");
      return request;
    },
    async onResponse({ response, options }) {
      if (response.status !== 401) {
        return response;
      }

      // 리프레시 토큰 자체가 만료된 경우
      if (response.url.includes("/auth/reissue")) {
        // 인증 실패에 대한 것을 app 레이어에 느슨한 결합도로 알림
        window.dispatchEvent(new Event("auth:failed"));
        return response;
      }

      if (!refreshPromise) {
        refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        }).finally(() => {
          refreshPromise = null;
        });
      }

      try {
        const refreshRes = await refreshPromise;

        if (refreshRes.ok) {
          return fetch(new Request(response.url, options as RequestInit));
        } else {
          throw new Error("리프레시 토큰 생성 실패");
        }
      } catch (error) {
        console.error("토큰 리프레시 실패, 로그아웃 처리.", error);
        // 인증 실패에 대한 것도ㅗ app 레이어에 느슨한 결합도로 알림
        window.dispatchEvent(new Event("auth:failed"));
        return response;
      }
    },
  });

  return client;
};
