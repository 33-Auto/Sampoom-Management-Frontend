import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore, useLogoutMutation } from "@/entities/user";
import { useNotification } from "@/shared/lib";
import type { UserResponse } from "@/shared/model";

interface UserMenuProps {
  user: UserResponse;
  profilePath?: string;
  loginPath?: string;
}

export function UserMenu({
  user,
  profilePath = "/profile",
  loginPath = "/login",
}: UserMenuProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const logoutMutation = useLogoutMutation();

  const { showError } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 클릭한 위치가 메뉴 영역 밖인지 확인
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      // Escape 키를 누르면 메뉴 닫기
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const displayName = user.userName ?? "-";
  const displayRole = user.position ?? user.role ?? user.workspace ?? "-";
  const displayEmail = user.email ?? "-";

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    if (profilePath) {
      navigate(profilePath);
    }
  };

  const handleLogoutClick = async () => {
    setIsOpen(false);
    try {
      await logoutMutation.mutateAsync({});
      logout();
      if (loginPath) {
        navigate(loginPath);
      }
    } catch {
      showError("로그아웃에 실패했습니다.");
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center space-x-4 rounded-lg px-2 py-1 transition-colors hover:cursor-pointer focus:outline-none dark:hover:bg-gray-700"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {displayRole}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {displayEmail}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
          <i className="ri-user-line text-gray-600 dark:text-gray-400"></i>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg hover:cursor-pointer dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {displayRole}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {displayEmail}
            </p>
          </div>

          <button
            type="button"
            onClick={handleProfileClick}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <i className="ri-edit-line text-base"></i>
            프로필 수정
          </button>

          <button
            type="button"
            onClick={handleLogoutClick}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
          >
            <i className="ri-logout-box-line text-base text-red-500"></i>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
