import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/widgets/Sidebar";
import { Button } from "@/shared/ui";

export default function FactoryDashboard() {
  const sidebarItems = [
    {
      path: "/factory/dashboard",
      label: "대시보드",
      icon: "ri-dashboard-line",
    },
    { path: "/factory/orders", label: "주문 관리", icon: "ri-file-list-line" },
    { path: "/factory/materials", label: "원자재 재고", icon: "ri-stack-line" },
    { path: "/factory/bom", label: "BOM 관리", icon: "ri-settings-3-line" },
    { path: "/factory/employees", label: "직원 관리", icon: "ri-team-line" },
  ];

  return (
    <div className="flex min-h-screen bg-bg-white transition-colors duration-200 dark:bg-bg-black">
      <Sidebar items={sidebarItems} userRole="Factory Manager" />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-grey-500 dark:text-grey-100">
            공장 관리 대시보드
          </h1>
          <p className="text-grey-400 dark:text-grey-300">
            오늘의 생산 현황을 확인하세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-500 dark:text-grey-300">
                  창고 신규 주문
                </p>
                <p className="mt-1 text-2xl font-bold text-grey-500 dark:text-grey-100">
                  8
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-main-100 dark:bg-main-800">
                <i className="ri-shopping-cart-line text-xl text-main-500 dark:text-main-300"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-success-green">
                +15.3%
              </span>
              <span className="ml-2 text-sm text-grey-400 dark:text-grey-400">
                전월 대비
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-500 dark:text-grey-300">
                  부족 원자재
                </p>
                <p className="mt-1 text-2xl font-bold text-grey-500 dark:text-grey-100">
                  3
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error-red/10 dark:bg-error-red/20">
                <i className="ri-alert-line text-xl text-error-red"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-error-red">
                주의 필요
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-500 dark:text-grey-300">
                  생산중인 주문
                </p>
                <p className="mt-1 text-2xl font-bold text-grey-500 dark:text-grey-100">
                  6
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-main-100 dark:bg-main-800">
                <i className="ri-settings-3-line text-xl text-main-500 dark:text-main-300"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-success-green">
                정상 진행
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-grey-500 dark:text-grey-300">
                  활성 직원
                </p>
                <p className="mt-1 text-2xl font-bold text-grey-500 dark:text-grey-100">
                  45
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-main-100 dark:bg-main-800">
                <i className="ri-team-line text-xl text-main-500 dark:text-main-300"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-success-green">
                98%
              </span>
              <span className="ml-2 text-sm text-grey-400 dark:text-grey-400">
                출근율
              </span>
            </div>
          </div>
        </div>

        {/* Recent Orders and Low Stock Materials */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Orders */}
          <div className="rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                최근 주문
              </h2>
              <Button variant="secondary" size="sm">
                전체 보기
              </Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  id: "ORD-001",
                  warehouse: "중앙 창고",
                  date: "2024-01-15",
                  status: "승인 대기",
                },
                {
                  id: "ORD-002",
                  warehouse: "북부 창고",
                  date: "2024-01-14",
                  status: "생산중",
                },
                {
                  id: "ORD-003",
                  warehouse: "남부 창고",
                  date: "2024-01-13",
                  status: "배송완료",
                },
                {
                  id: "ORD-004",
                  warehouse: "동부 창고",
                  date: "2024-01-12",
                  status: "승인 대기",
                },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black"
                >
                  <div>
                    <p className="font-medium text-grey-500 dark:text-grey-100">
                      {order.id}
                    </p>
                    <p className="text-sm text-grey-400 dark:text-grey-400">
                      {order.warehouse}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-grey-400 dark:text-grey-400">
                      {order.date}
                    </p>
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === "승인 대기"
                          ? "bg-warning-yellow/20 text-warning-yellow dark:bg-warning-yellow/30"
                          : order.status === "생산중"
                            ? "bg-main-100 text-main-800 dark:bg-main-800 dark:text-main-200"
                            : "bg-success-green/20 text-success-green dark:bg-success-green/30"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Materials */}
          <div className="rounded-xl border border-grey-100 bg-bg-card-white p-6 shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                부족 원자재
              </h2>
              <Button variant="secondary" size="sm">
                전체 보기
              </Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "알루미늄 봉",
                  current: 25,
                  minimum: 30,
                  category: "금속",
                },
                {
                  name: "고무 가스켓",
                  current: 45,
                  minimum: 100,
                  category: "고무",
                },
                {
                  name: "전자 부품",
                  current: 35,
                  minimum: 50,
                  category: "전자",
                },
                {
                  name: "강철 시트",
                  current: 80,
                  minimum: 150,
                  category: "금속",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black"
                >
                  <div>
                    <p className="font-medium text-grey-500 dark:text-grey-100">
                      {item.name}
                    </p>
                    <p className="text-sm text-grey-400 dark:text-grey-400">
                      {item.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-error-red">
                      {item.current}개
                    </p>
                    <p className="text-xs text-grey-400 dark:text-grey-400">
                      최소: {item.minimum}개
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
