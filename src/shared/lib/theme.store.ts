import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: (() => {
        // 초기값 설정: localStorage에서 읽거나 시스템 설정 확인
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("theme-storage");
            if (stored) {
              const parsed = JSON.parse(stored);
              return parsed?.state?.theme || "light";
            }
            // 시스템 다크 모드 설정 확인
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
              return "dark";
            }
          } catch {
            // 에러 시 기본값 반환
          }
        }
        return "light";
      })(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage",
    },
  ),
);
