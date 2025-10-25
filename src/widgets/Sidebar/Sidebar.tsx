import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarItem {
  path: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  items: SidebarItem[];
  userRole: string;
}

function Sidebar({ items, userRole }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className={`bg-main-900 text-white transition-all duration-300 dark:bg-main-900 ${isCollapsed ? "w-16" : "w-64"} flex min-h-screen flex-col`}
    >
      {/* Header */}
      <div className="border-b border-main-800 p-4 dark:border-main-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              {/* <div>
                <img src={Logo} alt="Logo" className="mx-auto h-8 w-auto" />
              </div> */}

              <div>
                <h1 className="text-lg font-bold text-white">삼품관리</h1>
                <p className="text-xs text-main-200">
                  {userRole === "Factory Manager"
                    ? "공장 관리자"
                    : "창고 관리자"}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-1">
            {/* {!isCollapsed && <ThemeToggle />} */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-main-800 dark:hover:bg-main-800"
            >
              <i
                className={`ri-${isCollapsed ? "menu-unfold" : "menu-fold"}-line text-white`}
              ></i>
            </button>
          </div>
        </div>
      </div>
      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.path}>
              <button
                onClick={async () => navigate(item.path)}
                className={`flex w-full cursor-pointer items-center rounded-lg px-3 py-3 transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-main-500 text-white shadow-sm"
                    : "text-main-200 hover:bg-main-800 hover:text-white dark:hover:bg-main-800"
                }`}
              >
                <div className="flex h-5 w-5 items-center justify-center">
                  <i className={item.icon}></i>
                </div>
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {/* 유저 프로필 및 로그아웃 */}
      <div className="border-t border-main-800 p-4 dark:border-main-800">
        {/* {isCollapsed && (
          <div className="mb-3 flex justify-center">
            <ThemeToggle />
          </div>
        )} */}
        <button
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center rounded-lg px-3 py-3 text-main-200 transition-all duration-200 hover:bg-main-800 hover:text-white dark:hover:bg-main-800"
        >
          <div className="flex h-5 w-5 items-center justify-center">
            <i className="ri-logout-box-line"></i>
          </div>
          {!isCollapsed && <span className="ml-3 font-medium">로그아웃</span>}
        </button>
      </div>
    </div>
  );
}

export { Sidebar };
