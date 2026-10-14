import { cn, useThemeStore } from "@/shared/lib";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <div className={cn("inline-block h-10 w-10 rounded-full", className)}>
      <button
        type="button"
        aria-label={
          theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"
        }
        className={cn(
          "flex cursor-pointer items-center justify-center transition-all duration-300 hover:translate-y-[-2px]",
          theme === "light" ? "text-gray-400" : "text-white",
        )}
        onClick={toggleTheme}
      >
        <i
          className={
            theme === "light"
              ? "ri-contrast-2-line text-4xl"
              : "ri-contrast-2-fill text-4xl"
          }
        />
      </button>
    </div>
  );
}
