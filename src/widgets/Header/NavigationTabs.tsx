import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface NavigationTabsProps {
  navItems: NavItem[];
  moduleColor: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  navItems,
  moduleColor,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  const isActive = (path: string): boolean => {
    if (
      path === "/factory" ||
      path === "/warehouse" ||
      path === "/production" ||
      path === "/hrm"
    ) {
      return (
        location.pathname.startsWith(path) &&
        !location.pathname.includes("/dashboard")
      );
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // 좁은 화면에서 탭이 가로 스크롤될 때 현재 탭이 보이도록 맞춘다
  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [location.pathname]);

  return (
    <div className="border-b border-gray-200 bg-bg-card-white dark:border-gray-700 dark:bg-bg-card-black">
      {/* 탭이 화면보다 길면 줄바꿈하지 않고 가로로 스크롤한다 */}
      <div className="[scrollbar-width:none] overflow-x-auto px-4 sm:px-6 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                ref={active ? activeTabRef : undefined}
                onClick={async () => navigate(item.path)}
                className={`relative shrink-0 rounded-t-lg px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors sm:px-4 ${
                  active
                    ? `${moduleColor} text-white`
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400"
                }`}
              >
                <i className={`${item.icon} mr-1.5 sm:mr-2`}></i>
                {item.label}
                {active && (
                  <div
                    className={`absolute right-0 bottom-0 left-0 h-0.5 ${moduleColor}`}
                  ></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;
