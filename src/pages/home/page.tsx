
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui';

export default function Home() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const modules = [
    {
      id: 'master',
      title: '기준 정보 관리',
      description: '품목, BOM, 거래처, 작업장, 공정 등 기준 데이터를 관리합니다',
      icon: 'ri-database-2-line',
      color: 'bg-blue-500',
      path: '/master/items',
      subMenus: [
        { title: '품목 마스터', path: '/master/items', icon: 'ri-archive-line' },
        { title: 'BOM 관리', path: '/master/bom', icon: 'ri-settings-3-line' },
        { title: '거래처 마스터', path: '/master/partners', icon: 'ri-building-line' },
        { title: '작업장 마스터', path: '/master/workcenters', icon: 'ri-tools-line' },
        { title: '공정 마스터', path: '/master/routings', icon: 'ri-route-line' }
      ]
    },
    {
      id: 'sales',
      title: '판매 관리',
      description: '대리점 주문 접수 및 판매 현황을 관리합니다',
      icon: 'ri-shopping-cart-line',
      color: 'bg-green-500',
      path: '/sales/orders',
      subMenus: [
        { title: '판매 주문', path: '/sales/orders', icon: 'ri-file-list-line' }
      ]
    },
    {
      id: 'wms',
      title: '재고 관리 (WMS)',
      description: '창고 출고 지시 및 재고 현황을 관리합니다',
      icon: 'ri-archive-drawer-line',
      color: 'bg-purple-500',
      path: '/wms/shipping',
      subMenus: [
        { title: '출고 지시', path: '/wms/shipping', icon: 'ri-truck-line' },
        { title: '재고 현황', path: '/wms/inventory', icon: 'ri-bar-chart-box-line' }
      ]
    },
    {
      id: 'production',
      title: '생산 관리',
      description: '생산 지시 및 작업 현황을 관리합니다',
      icon: 'ri-settings-4-line',
      color: 'bg-orange-500',
      path: '/production/orders',
      subMenus: [
        { title: '생산 지시', path: '/production/orders', icon: 'ri-hammer-line' }
      ]
    },
    {
      id: 'purchasing',
      title: '구매 관리',
      description: '구매 요청 및 발주 관리를 수행합니다',
      icon: 'ri-shopping-bag-line',
      color: 'bg-red-500',
      path: '/purchasing/requests',
      subMenus: [
        { title: '구매 요청', path: '/purchasing/requests', icon: 'ri-file-add-line' },
        { title: '구매 주문', path: '/purchasing/orders', icon: 'ri-file-check-line' }
      ]
    },
    {
      id: 'hrm',
      title: '인사 관리 (HRM)',
      description: '직원 정보, 급여, 근태 및 평가 관리를 수행합니다',
      icon: 'ri-team-line',
      color: 'bg-teal-500',
      path: '/hrm/employees',
      subMenus: [
        { title: '직원 관리', path: '/hrm/employees', icon: 'ri-user-line' },
        { title: '급여 관리', path: '/hrm/payroll', icon: 'ri-money-dollar-circle-line' },
        { title: '근태 관리', path: '/hrm/attendance', icon: 'ri-time-line' },
        { title: '평가 관리', path: '/hrm/evaluation', icon: 'ri-star-line' }
      ]
    }
  ];

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">B2B 부품 공급망 관리 시스템</h1>
              <p className="text-gray-600 mt-1">
                {currentTime.toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })} {currentTime.toLocaleTimeString('ko-KR')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                <i className="ri-user-line mr-2"></i>
                로그인
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/signup')}>
                <i className="ri-user-add-line mr-2"></i>
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System Overview */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">시스템 개요</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-smartphone-line text-white text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900">대리점 주문</h3>
                <p className="text-sm text-gray-600 mt-1">App으로 부품 주문</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-truck-line text-white text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900">창고 출고</h3>
                <p className="text-sm text-gray-600 mt-1">재고 관리 및 출고</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-hammer-line text-white text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900">공장 생산</h3>
                <p className="text-sm text-gray-600 mt-1">BOM 기반 생산</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-shopping-bag-line text-white text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900">원자재 구매</h3>
                <p className="text-sm text-gray-600 mt-1">외부 조달 관리</p>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="ri-team-line text-white text-xl"></i>
                </div>
                <h3 className="font-medium text-gray-900">인사 관리</h3>
                <p className="text-sm text-gray-600 mt-1">직원 정보 및 급여</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center mr-4`}>
                    <i className={`${module.icon} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {module.subMenus.map((subMenu, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <i className={`${subMenu.icon} mr-2`}></i>
                      <span>{subMenu.title}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleModuleClick(module.path)}
                  className="w-full"
                >
                  <i className="ri-arrow-right-line mr-2"></i>
                  모듈 접속
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">시스템 현황</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">등록된 품목</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">23</div>
                <div className="text-sm text-gray-600">대기 중인 주문</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">8</div>
                <div className="text-sm text-gray-600">생산 지시</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-sm text-gray-600">구매 요청</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">87</div>
                <div className="text-sm text-gray-600">등록된 직원</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}