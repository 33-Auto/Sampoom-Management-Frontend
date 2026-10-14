import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/entities/user/model/auth.store";
import { UserMenu } from "@/features/user-menu";
import { Button } from "@/shared/ui";

interface ModuleHeaderProps {
  moduleTitle: string;
  moduleDescription: string;
  moduleIcon: string;
  moduleColor: string;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  moduleTitle,
  moduleDescription,
  moduleIcon,
  moduleColor,
}) => {
  const navigate = useNavigate();
  const isHome = moduleTitle === "삼삼오토";
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="border-b border-gray-200 bg-bg-card-white dark:border-gray-700 dark:bg-bg-card-black">
      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* 좌측: 메인으로 가기 버튼과 모듈 정보 (좁은 화면에서는 말줄임) */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            {!isHome && (
              <>
                <button
                  onClick={async () => navigate("/home")}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400"
                  aria-label="홈으로"
                >
                  <i className="ri-arrow-left-line text-lg"></i>
                </button>

                <div className="hidden h-8 w-px bg-gray-300 sm:block dark:bg-gray-700"></div>
              </>
            )}

            <div
              className={`h-10 w-10 shrink-0 sm:h-12 sm:w-12 ${moduleColor} flex items-center justify-center rounded-lg`}
            >
              <i className={`${moduleIcon} text-xl text-white sm:text-2xl`}></i>
            </div>
            <div className="flex min-w-0 flex-col sm:gap-1">
              <h1 className="truncate text-lg font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
                {moduleTitle}
              </h1>

              <p className="truncate text-xs text-gray-600 sm:text-base dark:text-gray-400">
                {moduleDescription}
              </p>
            </div>
          </div>

          {/* 우측: 사용자 정보 */}
          {isLoggedIn && user ? (
            <div className="shrink-0">
              <UserMenu user={user} profilePath="/profile" loginPath="/login" />
            </div>
          ) : (
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => navigate("/login")}
              >
                <i className="ri-user-line sm:mr-2"></i>
                <span className="hidden sm:inline">로그인</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={async () => navigate("/signup")}
              >
                <i className="ri-user-add-line sm:mr-2"></i>
                <span className="hidden sm:inline">회원가입</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
