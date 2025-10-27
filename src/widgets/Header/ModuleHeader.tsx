import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  userEmail
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 좌측: 메인으로 가기 버튼과 모듈 정보 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <i className="ri-arrow-left-line text-lg"></i>
            </button>
            
            <div className="h-8 w-px bg-gray-300"></div>
            
            <div className={`w-12 h-12 ${moduleColor} rounded-lg flex items-center justify-center`}>
              <i className={`${moduleIcon} text-2xl text-white`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{moduleTitle}</h1>
              <p className="text-gray-600">{moduleDescription}</p>
            </div>
          </div>

          {/* 우측: 사용자 정보 */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userRole}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="ri-user-line text-gray-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;


