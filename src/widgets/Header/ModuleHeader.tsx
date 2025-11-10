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
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측: 메인으로 가기 버튼과 모듈 정보 */}
          <div className="flex items-center space-x-4">
            {!isHome && (
              <>
                <button
                  onClick={async () => navigate("/home")}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400"
                >
                  <i className="ri-arrow-left-line text-lg"></i>
                </button>

                <div className="h-8 w-px bg-gray-300 dark:bg-gray-700"></div>
              </>
            )}

            <div
              className={`h-12 w-12 ${moduleColor} flex items-center justify-center rounded-lg`}
            >
              <i className={`${moduleIcon} text-2xl text-white`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {moduleTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {moduleDescription}
              </p>
            </div>
          </div>

          {/* 우측: 사용자 정보 */}
          {isLoggedIn && user ? (
            <UserMenu user={user} profilePath="/profile" loginPath="/login" />
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => navigate("/login")}
              >
                <i className="ri-user-line mr-2"></i>
                로그인
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={async () => navigate("/signup")}
              >
                <i className="ri-user-add-line mr-2"></i>
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
