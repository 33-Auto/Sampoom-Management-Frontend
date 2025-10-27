import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui";

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
      id: "master",
      title: "기준 정보 관리",
      description:
        "품목, BOM, 거래처, 작업장, 공정 등 기준 데이터를 관리합니다",
      icon: "ri-database-2-line",
      color: "bg-blue-500",
      path: "/master/items",
      subMenus: [
        {
          title: "품목 마스터",
          path: "/master/items",
          icon: "ri-archive-line",
        },
        { title: "BOM 관리", path: "/master/bom", icon: "ri-settings-3-line" },
        {
          title: "거래처 마스터",
          path: "/master/partners",
          icon: "ri-building-line",
        },
        {
          title: "작업장 마스터",
          path: "/master/workcenters",
          icon: "ri-tools-line",
        },
        {
          title: "공정 마스터",
          path: "/master/routings",
          icon: "ri-route-line",
        },
      ],
    },
    {
      id: "sales",
      title: "판매 관리",
      description: "대리점 주문 접수 및 판매 현황을 관리합니다",
      icon: "ri-shopping-cart-line",
      color: "bg-green-500",
      path: "/sales/orders",
      subMenus: [
        {
          title: "판매 주문",
          path: "/sales/orders",
          icon: "ri-file-list-line",
        },
      ],
    },
    {
      id: "wms",
      title: "재고 관리 (WMS)",
      description: "창고 출고 지시 및 재고 현황을 관리합니다",
      icon: "ri-archive-drawer-line",
      color: "bg-purple-500",
      path: "/wms/shipping",
      subMenus: [
        { title: "출고 지시", path: "/wms/shipping", icon: "ri-truck-line" },
        {
          title: "재고 현황",
          path: "/wms/inventory",
          icon: "ri-bar-chart-box-line",
        },
      ],
    },
    {
      id: "production",
      title: "생산 관리",
      description: "생산 지시 및 작업 현황을 관리합니다",
      icon: "ri-settings-4-line",
      color: "bg-orange-500",
      path: "/production/orders",
      subMenus: [
        {
          title: "생산 지시",
          path: "/production/orders",
          icon: "ri-hammer-line",
        },
      ],
    },
    {
      id: "purchasing",
      title: "구매 관리",
      description: "구매 요청 및 발주 관리를 수행합니다",
      icon: "ri-shopping-bag-line",
      color: "bg-red-500",
      path: "/purchasing/requests",
      subMenus: [
        {
          title: "구매 요청",
          path: "/purchasing/requests",
          icon: "ri-file-add-line",
        },
        {
          title: "구매 주문",
          path: "/purchasing/orders",
          icon: "ri-file-check-line",
        },
      ],
    },
    {
      id: "hrm",
      title: "인사 관리 (HRM)",
      description: "직원 정보, 급여, 근태 및 평가 관리를 수행합니다",
      icon: "ri-team-line",
      color: "bg-teal-500",
      path: "/hrm/employees",
      subMenus: [
        { title: "직원 관리", path: "/hrm/employees", icon: "ri-user-line" },
        {
          title: "급여 관리",
          path: "/hrm/payroll",
          icon: "ri-money-dollar-circle-line",
        },
        { title: "근태 관리", path: "/hrm/attendance", icon: "ri-time-line" },
        { title: "평가 관리", path: "/hrm/evaluation", icon: "ri-star-line" },
      ],
    },
  ];

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                B2B 부품 공급망 관리 시스템
              </h1>
              <p className="mt-1 text-gray-600">
                {currentTime.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                })}{" "}
                {currentTime.toLocaleTimeString("ko-KR")}
              </p>
            </div>
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* System Overview */}
        <div className="mb-8">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              시스템 개요
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                  <i className="ri-smartphone-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900">대리점 주문</h3>
                <p className="mt-1 text-sm text-gray-600">App으로 부품 주문</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
                  <i className="ri-truck-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900">창고 출고</h3>
                <p className="mt-1 text-sm text-gray-600">재고 관리 및 출고</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                  <i className="ri-hammer-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900">공장 생산</h3>
                <p className="mt-1 text-sm text-gray-600">BOM 기반 생산</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500">
                  <i className="ri-shopping-bag-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900">원자재 구매</h3>
                <p className="mt-1 text-sm text-gray-600">외부 조달 관리</p>
              </div>
              <div className="rounded-lg bg-teal-50 p-4 text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500">
                  <i className="ri-team-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900">인사 관리</h3>
                <p className="mt-1 text-sm text-gray-600">직원 정보 및 급여</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.id}
              className="rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center">
                  <div
                    className={`h-12 w-12 ${module.color} mr-4 flex items-center justify-center rounded-lg`}
                  >
                    <i className={`${module.icon} text-xl text-white`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  {module.subMenus.map((subMenu, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
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
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              시스템 현황
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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
