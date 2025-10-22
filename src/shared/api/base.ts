import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "@/shared/api/v1";

const BASE_URL: string = import.meta.env.VITE_BASE_URL;

const createAuthAwareFetchClient = () => {
  const fetchClient = createFetchClient<paths>({
    baseUrl: BASE_URL,
    credentials: "include",
  });

  console.log("API Client created with BASE_URL:", BASE_URL);

  let refreshPromise: Promise<Response> | null = null;

  fetchClient.use({
    async onRequest({ request }) {
      request.headers.set("Content-Type", "application/json");
      request.headers.set("X-Client-Type", "WEB");
      return request;
    },
    async onResponse({ response, options }) {
      if (response.status !== 401) {
        return response;
      }

      if (response.url.includes("/auth/refresh")) {
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
        window.dispatchEvent(new Event("auth:failed"));
        return response;
      }
    },
  });

  return fetchClient;
};

export const fetchClient = createAuthAwareFetchClient();
export const queryClient = createClient(fetchClient);
