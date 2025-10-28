import React from "react";
import { useNavigate } from "react-router-dom";

interface ModuleHeaderProps {
  moduleTitle: string;
  moduleDescription: string;
  moduleIcon: string;
  moduleColor: string;
  userRole: string;
  userEmail: string;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  moduleTitle,
  moduleDescription,
  moduleIcon,
  moduleColor,
  userRole,
  userEmail,
}) => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측: 메인으로 가기 버튼과 모듈 정보 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={async () => navigate("/home")}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <i className="ri-arrow-left-line text-lg"></i>
            </button>

            <div className="h-8 w-px bg-gray-300"></div>

            <div
              className={`h-12 w-12 ${moduleColor} flex items-center justify-center rounded-lg`}
            >
              <i className={`${moduleIcon} text-2xl text-white`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {moduleTitle}
              </h1>
              <p className="text-gray-600">{moduleDescription}</p>
            </div>
          </div>

          {/* 우측: 사용자 정보 */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userRole}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <i className="ri-user-line text-gray-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;
