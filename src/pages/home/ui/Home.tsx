import { useNavigate } from "react-router-dom";

import { Card } from "@/shared/ui";
import HomeLayout from "@/widgets/Layout/HomeLayout";

export const Home = () => {
  const navigate = useNavigate();

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
        // {
        //   title: "입고 관리",
        //   path: "/wms/receiving",
        //   icon: "ri-file-list-3-line",
        // },
        {
          title: "발주 관리",
          path: "/wms/orders",
          icon: "ri-shopping-bag-line",
        },
        {
          title: "ROP 설정",
          path: "/wms/rop-settings",
          icon: "ri-settings-3-line",
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
        {
          title: "생산 계획",
          path: "/production/planning",
          icon: "ri-calendar-line",
        },
        {
          title: "생산 스케줄",
          path: "/production/mps",
          icon: "ri-calendar-schedule-line",
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
      ],
    },
    {
      id: "hrm",
      title: "인사 관리 (HRM)",
      description: "직원 정보를 조회합니다",
      icon: "ri-team-line",
      color: "bg-teal-500",
      path: "/hrm/employees",
      subMenus: [
        { title: "직원 관리", path: "/hrm/employees", icon: "ri-user-line" },
      ],
    },
  ];

  const handleModuleClick = (path: string) => {
    navigate(path);
  };

  return (
    <HomeLayout>
      {/* 메인 콘텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 시스템 개요 */}
        <div className="mb-8">
          <Card>
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              시스템 개요
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                  <i className="ri-smartphone-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  대리점 주문
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  App으로 부품 주문
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
                  <i className="ri-truck-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  창고 출고
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  재고 관리 및 출고
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/20">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                  <i className="ri-hammer-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  공장 생산
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  BOM 기반 생산
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500">
                  <i className="ri-shopping-bag-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  원자재 구매
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  외부 조달 관리
                </p>
              </div>
              <div className="rounded-lg bg-teal-50 p-4 text-center dark:bg-teal-900/20">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500">
                  <i className="ri-team-line text-xl text-white"></i>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  인사 관리
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  직원 정보 및 급여
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 모듈 카드 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <Card
              key={module.id}
              onClick={() => handleModuleClick(module.path)}
              className="group cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-xl"
            >
              <div className="relative">
                {/* 우측 상단 화살표 아이콘 */}
                <div className="absolute top-0 right-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <i className="ri-arrow-right-up-line text-lg text-gray-600 dark:text-gray-300"></i>
                  </div>
                </div>

                <div className="mb-4 flex items-center">
                  <div
                    className={`h-12 w-12 ${module.color} mr-4 flex items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110`}
                  >
                    <i className={`${module.icon} text-xl text-white`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {module.subMenus.map((subMenu, index) => (
                    <div
                      key={index}
                      onClick={(e) => {
                        // 이벤트 전파 방지를 위해 이벤트 스톱
                        e.stopPropagation();
                        navigate(subMenu.path);
                      }}
                      className="group/item flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    >
                      <i
                        className={`${subMenu.icon} mr-2 transition-transform duration-150 group-hover/item:translate-x-0.5`}
                      ></i>
                      <span>{subMenu.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
};
