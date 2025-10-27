import { useNotification } from "@/app/providers/NotificationContext";
import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

export default function WarehouseDashboard() {
  const { showSuccess, showInfo } = useNotification();

  const headerConfig = {
    moduleTitle: "창고 관리",
    moduleDescription: "창고 운영 현황을 실시간으로 모니터링하세요",
    moduleIcon: "ri-archive-line",
    moduleColor: "bg-indigo-600",
    userRole: "창고 관리자",
    userEmail: "warehouse@company.com",
    navItems: [
      {
        path: "/warehouse",
        label: "창고 대시보드",
        icon: "ri-dashboard-line",
        active: true,
      },
      {
        path: "/warehouse/orders",
        label: "주문 관리",
        icon: "ri-file-list-3-line",
      },
      {
        path: "/warehouse/inventory",
        label: "재고 관리",
        icon: "ri-archive-line",
      },
      {
        path: "/warehouse/employees",
        label: "직원 관리",
        icon: "ri-team-line",
      },
    ],
  };

  const navItems = headerConfig.navItems;

  const handleQuickAction = (action: string) => {
    if (!window.confirm(`${action}을 실행하시겠습니까?`)) return;
    showSuccess("완료", `${action}이 성공적으로 처리되었습니다.`);
  };

  const handleViewAll = (section: string) => {
    showInfo("알림", `${section} 전체 목록으로 이동합니다.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-indigo-600" />

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  총 재고 품목
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  1,247
                </p>
                <p className="mt-1 text-xs" style={{ color: "#7C7C7C" }}>
                  전월 대비 +12%
                </p>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "#E6E6FF" }}
              >
                <i
                  className="ri-archive-line text-xl"
                  style={{ color: "#8080FF" }}
                ></i>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  오늘 출고
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  89
                </p>
                <p className="mt-1 text-xs" style={{ color: "#7C7C7C" }}>
                  어제 대비 +5%
                </p>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "#E6E6FF" }}
              >
                <i
                  className="ri-truck-line text-xl"
                  style={{ color: "#8080FF" }}
                ></i>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  대기 주문
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  23
                </p>
                <p className="mt-1 text-xs" style={{ color: "#FF6C6C" }}>
                  긴급 처리 필요
                </p>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "#FFE6E6" }}
              >
                <i
                  className="ri-time-line text-xl"
                  style={{ color: "#FF6C6C" }}
                ></i>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  창고 가동률
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  87%
                </p>
                <p className="mt-1 text-xs" style={{ color: "#10B981" }}>
                  정상 운영
                </p>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: "#E6F7FF" }}
              >
                <i
                  className="ri-pie-chart-line text-xl"
                  style={{ color: "#10B981" }}
                ></i>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Today's Orders */}
          <div
            className="rounded-lg border lg:col-span-2"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
              <div className="flex items-center justify-between">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "#17191B" }}
                >
                  오늘의 주문 현황
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm" style={{ color: "#7C7C7C" }}>
                    총 5건
                  </span>
                  <button
                    onClick={() => handleViewAll("주문 현황")}
                    className="inline-flex cursor-pointer items-center justify-center rounded-lg border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:opacity-90 active:opacity-80"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E9EAEC",
                      color: "#17191B",
                    }}
                  >
                    전체 보기
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div
                  className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#17191B" }}
                      >
                        WH-2024-0115-001
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        09:15
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm" style={{ color: "#17191B" }}>
                        서울 강남 대리점
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        15개 품목
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="rounded-full border px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#FFE6E6",
                        color: "#FF6C6C",
                        borderColor: "#FF6C6C",
                      }}
                    >
                      긴급
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                    >
                      픽업 대기
                    </span>
                  </div>
                </div>

                <div
                  className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#17191B" }}
                      >
                        WH-2024-0115-002
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        10:30
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm" style={{ color: "#17191B" }}>
                        부산 해운대 대리점
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        8개 품목
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="rounded-full border px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#E6E6FF",
                        color: "#8080FF",
                        borderColor: "#8080FF",
                      }}
                    >
                      보통
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={{ backgroundColor: "#D1FAE5", color: "#10B981" }}
                    >
                      포장 완료
                    </span>
                  </div>
                </div>

                <div
                  className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#17191B" }}
                      >
                        WH-2024-0115-003
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        11:45
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm" style={{ color: "#17191B" }}>
                        대구 수성 대리점
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        22개 품목
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="rounded-full border px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#FED7AA",
                        color: "#EA580C",
                        borderColor: "#EA580C",
                      }}
                    >
                      높음
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
                    >
                      처리중
                    </span>
                  </div>
                </div>

                <div
                  className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#17191B" }}
                      >
                        WH-2024-0115-004
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        13:20
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm" style={{ color: "#17191B" }}>
                        인천 연수 대리점
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        12개 품목
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="rounded-full border px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#E6E6FF",
                        color: "#8080FF",
                        borderColor: "#8080FF",
                      }}
                    >
                      보통
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={{ backgroundColor: "#FED7AA", color: "#EA580C" }}
                    >
                      승인 대기
                    </span>
                  </div>
                </div>

                <div
                  className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#17191B" }}
                      >
                        WH-2024-0115-005
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        14:10
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm" style={{ color: "#17191B" }}>
                        광주 서구 대리점
                      </span>
                      <span className="text-xs" style={{ color: "#7C7C7C" }}>
                        6개 품목
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="rounded-full border px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#E9EAEC",
                        color: "#444444",
                        borderColor: "#CCCCCC",
                      }}
                    >
                      낮음
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={{ backgroundColor: "#EDE9FE", color: "#7C3AED" }}
                    >
                      배송 준비
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div
              className="rounded-lg border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
            >
              <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "#17191B" }}
                >
                  빠른 작업
                </h2>
              </div>
              <div className="space-y-3 p-4">
                <button
                  onClick={() => handleQuickAction("신규 입고 등록")}
                  className="flex w-full items-center justify-between rounded-lg border p-3 transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5", borderColor: "#E9EAEC" }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#E6E6FF" }}
                    >
                      <i
                        className="ri-add-line"
                        style={{ color: "#8080FF" }}
                      ></i>
                    </div>
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      신규 입고
                    </span>
                  </div>
                  <i
                    className="ri-arrow-right-s-line"
                    style={{ color: "#7C7C7C" }}
                  ></i>
                </button>

                <button
                  onClick={() => handleQuickAction("출고 처리")}
                  className="flex w-full items-center justify-between rounded-lg border p-3 transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5", borderColor: "#E9EAEC" }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#E6E6FF" }}
                    >
                      <i
                        className="ri-truck-line"
                        style={{ color: "#8080FF" }}
                      ></i>
                    </div>
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      출고 처리
                    </span>
                  </div>
                  <i
                    className="ri-arrow-right-s-line"
                    style={{ color: "#7C7C7C" }}
                  ></i>
                </button>

                <button
                  onClick={() => handleQuickAction("재고 조사")}
                  className="flex w-full items-center justify-between rounded-lg border p-3 transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5", borderColor: "#E9EAEC" }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#E6E6FF" }}
                    >
                      <i
                        className="ri-search-line"
                        style={{ color: "#8080FF" }}
                      ></i>
                    </div>
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      재고 조사
                    </span>
                  </div>
                  <i
                    className="ri-arrow-right-s-line"
                    style={{ color: "#7C7C7C" }}
                  ></i>
                </button>

                <button
                  onClick={() => handleQuickAction("바코드 스캔")}
                  className="flex w-full items-center justify-between rounded-lg border p-3 transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: "#F5F5F5", borderColor: "#E9EAEC" }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#E6E6FF" }}
                    >
                      <i
                        className="ri-qr-scan-line"
                        style={{ color: "#8080FF" }}
                      ></i>
                    </div>
                    <span className="font-medium" style={{ color: "#17191B" }}>
                      바코드 스캔
                    </span>
                  </div>
                  <i
                    className="ri-arrow-right-s-line"
                    style={{ color: "#7C7C7C" }}
                  ></i>
                </button>
              </div>
            </div>

            {/* Alerts */}
            <div
              className="rounded-lg border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
            >
              <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "#17191B" }}
                >
                  알림
                </h2>
              </div>
              <div className="space-y-3 p-4">
                <div
                  className="flex items-start space-x-3 rounded-lg p-3"
                  style={{ backgroundColor: "#FFE6E6" }}
                >
                  <div
                    className="mt-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#FF6C6C" }}
                  ></div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17191B" }}
                    >
                      재고 부족 경고
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "#7C7C7C" }}>
                      전자부품 A-001의 재고가 10개 미만입니다.
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      5분 전
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 rounded-lg p-3"
                  style={{ backgroundColor: "#FEF3C7" }}
                >
                  <div
                    className="mt-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#D97706" }}
                  ></div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17191B" }}
                    >
                      배송 지연
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "#7C7C7C" }}>
                      WH-2024-0114-023 주문이 예정보다 지연되고 있습니다.
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      15분 전
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-start space-x-3 rounded-lg p-3"
                  style={{ backgroundColor: "#D1FAE5" }}
                >
                  <div
                    className="mt-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#10B981" }}
                  ></div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17191B" }}
                    >
                      입고 완료
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "#7C7C7C" }}>
                      신규 부품 500개가 성공적으로 입고되었습니다.
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      1시간 전
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Inventory Status */}
          <div
            className="rounded-lg border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
              <h2
                className="text-lg font-semibold"
                style={{ color: "#17191B" }}
              >
                재고 현황
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    전자부품
                  </span>
                  <span className="text-sm" style={{ color: "#7C7C7C" }}>
                    85%
                  </span>
                </div>
                <div
                  className="h-2 w-full rounded-full"
                  style={{ backgroundColor: "#E9EAEC" }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{ width: "85%", backgroundColor: "#8080FF" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    기계부품
                  </span>
                  <span className="text-sm" style={{ color: "#7C7C7C" }}>
                    72%
                  </span>
                </div>
                <div
                  className="h-2 w-full rounded-full"
                  style={{ backgroundColor: "#E9EAEC" }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{ width: "72%", backgroundColor: "#8080FF" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    소모품
                  </span>
                  <span className="text-sm" style={{ color: "#7C7C7C" }}>
                    45%
                  </span>
                </div>
                <div
                  className="h-2 w-full rounded-full"
                  style={{ backgroundColor: "#E9EAEC" }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{ width: "45%", backgroundColor: "#FF6C6C" }}
                  ></div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    포장재
                  </span>
                  <span className="text-sm" style={{ color: "#7C7C7C" }}>
                    91%
                  </span>
                </div>
                <div
                  className="h-2 w-full rounded-full"
                  style={{ backgroundColor: "#E9EAEC" }}
                >
                  <div
                    className="h-2 rounded-full"
                    style={{ width: "91%", backgroundColor: "#10B981" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div
            className="rounded-lg border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
              <h2
                className="text-lg font-semibold"
                style={{ color: "#17191B" }}
              >
                최근 활동
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#E6E6FF" }}
                  >
                    <i
                      className="ri-truck-line text-sm"
                      style={{ color: "#8080FF" }}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17191B" }}
                    >
                      출고 완료
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      WH-2024-0115-001 주문이 출고되었습니다.
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C" }}>
                      방금 전
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#D1FAE5" }}
                  >
                    <i
                      className="ri-add-line text-sm"
                      style={{ color: "#10B981" }}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17191B" }}
                    >
                      신규 입고
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      전자부품 B-205가 200개 입고되었습니다.
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      10분 전
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-8 w-8 ...">
                    <i
                      className="ri-edit-line text-sm"
                      style={{ color: "#D97706" }}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17191B" }}
                    >
                      재고 수정
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C7C" }}>
                      기계부품 C-301의 재고가 수정되었습니다.
                    </p>
                    <tspan></tspan>
                  </div>
                </div>

                <div className="flex ...">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#FFE6E6" }}
                  >
                    <i
                      className="ri-alert-line text-sm"
                      style={{ color: "#FF6C6C" }}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#17191B" }}
                    >
                      재고 부족 알림
                    </p>
                    <p className="text-xs" style={{ color: "#7C7C" }}>
                      소모품 D-999
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
