import ModuleHeader from "@/widgets/Header/ModuleHeader";
import NavigationTabs from "@/widgets/Header/NavigationTabs";

export default function FactoryDashboard() {
  const headerConfig = {
    moduleTitle: "생산 관리",
    moduleDescription: "생산 라인, 주문 및 품질을 관리합니다",
    moduleIcon: "ri-factory-line",
    moduleColor: "bg-blue-600",
    userRole: "생산 관리자",
    userEmail: "factory@company.com",
    navItems: [
      {
        path: "/factory",
        label: "생산 대시보드",
        icon: "ri-dashboard-line",
        active: true,
      },
      {
        path: "/factory/orders",
        label: "주문 관리",
        icon: "ri-file-list-line",
      },
      {
        path: "/factory/materials",
        label: "원자재 재고",
        icon: "ri-stack-line",
      },
      { path: "/factory/bom", label: "BOM 관리", icon: "ri-settings-3-line" },
      { path: "/factory/employees", label: "직원 관리", icon: "ri-team-line" },
    ],
  };

  const productionLines = [
    {
      id: "LINE-A",
      name: "엔진 조립 라인",
      status: "running",
      efficiency: 94,
      currentOrder: "PO-2024-0115-A",
      target: 120,
      completed: 87,
    },
    {
      id: "LINE-B",
      name: "브레이크 시스템 라인",
      status: "maintenance",
      efficiency: 0,
      currentOrder: null,
      target: 80,
      completed: 0,
    },
    {
      id: "LINE-C",
      name: "전자 부품 라인",
      status: "running",
      efficiency: 87,
      currentOrder: "PO-2024-0115-C",
      target: 200,
      completed: 156,
    },
    {
      id: "LINE-D",
      name: "필터 조립 라인",
      status: "idle",
      efficiency: 0,
      currentOrder: null,
      target: 150,
      completed: 0,
    },
  ];

  const materialAlerts = [
    {
      code: "MAT-001",
      name: "알루미늄 합금 봉재",
      current: 15,
      minimum: 50,
      unit: "kg",
      criticality: "high",
      supplier: "포스코",
    },
    {
      code: "MAT-002",
      name: "고무 시일링",
      current: 25,
      minimum: 100,
      unit: "개",
      criticality: "critical",
      supplier: "한국타이어",
    },
    {
      code: "MAT-003",
      name: "전자 센서",
      current: 8,
      minimum: 30,
      unit: "개",
      criticality: "medium",
      supplier: "삼성전자",
    },
    {
      code: "MAT-004",
      name: "스테인리스 볼트",
      current: 45,
      minimum: 200,
      unit: "개",
      criticality: "high",
      supplier: "동국제강",
    },
  ];

  const qualityMetrics = [
    { metric: "불량률", value: "0.8%", target: "< 1.0%", status: "good" },
    { metric: "재작업률", value: "2.1%", target: "< 3.0%", status: "good" },
    {
      metric: "검사 통과율",
      value: "98.7%",
      target: "> 98.0%",
      status: "excellent",
    },
    {
      metric: "고객 반품률",
      value: "0.3%",
      target: "< 0.5%",
      status: "excellent",
    },
  ];

  const getLineStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-700 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "idle":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getLineStatusText = (status: string) => {
    switch (status) {
      case "running":
        return "가동중";
      case "maintenance":
        return "정비중";
      case "idle":
        return "대기중";
      case "error":
        return "오류";
      default:
        return "알 수 없음";
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "high":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "warning":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const navItems = [
    {
      path: "/factory/dashboard",
      label: "생산 대시보드",
      icon: "ri-dashboard-line",
    },
    { path: "/factory/orders", label: "주문 관리", icon: "ri-file-list-line" },
    { path: "/factory/materials", label: "원자재 재고", icon: "ri-stack-line" },
    { path: "/factory/bom", label: "BOM 관리", icon: "ri-settings-3-line" },
    { path: "/factory/employees", label: "직원 관리", icon: "ri-team-line" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModuleHeader {...headerConfig} />
      <NavigationTabs navItems={navItems} moduleColor="bg-blue-600" />
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Key Production Metrics */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="rounded-lg border p-4 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  오늘 생산량
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  243개
                </p>
                <p className="mt-1 text-xs text-green-600">목표 대비 81%</p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#E6E6FF" }}
              >
                <i className="ri-factory-line" style={{ color: "#8080FF" }}></i>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-4 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  가동 라인
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  2/4개
                </p>
                <p className="mt-1 text-xs text-yellow-600">1개 정비중</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-settings-3-line text-green-600"></i>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-4 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  평균 효율성
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  90.5%
                </p>
                <p className="mt-1 text-xs text-green-600">+2.3% (어제 대비)</p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: "#CCCCFF" }}
              >
                <i
                  className="ri-speed-up-line"
                  style={{ color: "#4C4CBB" }}
                ></i>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg border p-4 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#7C7C7C" }}>
                  품질 지수
                </p>
                <p className="text-2xl font-bold" style={{ color: "#17191B" }}>
                  98.7%
                </p>
                <p className="mt-1 text-xs text-green-600">목표 달성</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-award-line text-green-600"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Production Lines Status */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div
            className="rounded-lg border shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
              <h2
                className="text-lg font-semibold"
                style={{ color: "#17191B" }}
              >
                생산 라인 현황
              </h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {productionLines.map((line) => (
                  <div
                    key={line.id}
                    className="rounded-lg p-4"
                    style={{ backgroundColor: "#F5F5F5" }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span
                          className="font-medium"
                          style={{ color: "#17191B" }}
                        >
                          {line.name}
                        </span>
                        <span
                          className={`rounded-full border px-2 py-1 text-xs font-medium ${getLineStatusColor(line.status)}`}
                        >
                          {getLineStatusText(line.status)}
                        </span>
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#7C7C7C" }}
                      >
                        {line.status === "running"
                          ? `${line.efficiency}%`
                          : "-"}
                      </span>
                    </div>

                    {line.status === "running" && (
                      <>
                        <div
                          className="mb-2 flex items-center justify-between text-sm"
                          style={{ color: "#7C7C7C" }}
                        >
                          <span>
                            진행률: {line.completed}/{line.target}개
                          </span>
                          <span>주문: {line.currentOrder}</span>
                        </div>
                        <div
                          className="h-2 w-full rounded-full"
                          style={{ backgroundColor: "#CCCCCC" }}
                        >
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(line.completed / line.target) * 100}%`,
                              backgroundColor: "#8080FF",
                            }}
                          ></div>
                        </div>
                      </>
                    )}

                    {line.status === "maintenance" && (
                      <p className="text-sm text-yellow-600">
                        정기 점검 진행 중 (예상 완료: 16:30)
                      </p>
                    )}

                    {line.status === "idle" && (
                      <p className="text-sm" style={{ color: "#7C7C7C" }}>
                        다음 주문 대기 중
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Material Alerts */}
          <div
            className="rounded-lg border shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
          >
            <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
              <div className="flex items-center justify-between">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "#17191B" }}
                >
                  원자재 부족 알림
                </h2>
                <i className="ri-alert-line" style={{ color: "#FF6C6C" }}></i>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {materialAlerts.map((material) => (
                  <div
                    key={material.code}
                    className="rounded-lg border-l-4 p-3"
                    style={{
                      backgroundColor: "#F5F5F5",
                      borderLeftColor: "#FF6C6C",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center space-x-2">
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#17191B" }}
                          >
                            {material.code}
                          </span>
                          <span
                            className={`rounded border px-1.5 py-0.5 text-xs ${getCriticalityColor(material.criticality)}`}
                          >
                            {material.criticality === "critical"
                              ? "긴급"
                              : material.criticality === "high"
                                ? "높음"
                                : "보통"}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: "#7C7C7C" }}>
                          {material.name}
                        </p>
                        <div
                          className="mt-2 flex items-center justify-between text-xs"
                          style={{ color: "#7C7C7C" }}
                        >
                          <span>
                            현재: {material.current}
                            {material.unit}
                          </span>
                          <span>
                            최소: {material.minimum}
                            {material.unit}
                          </span>
                        </div>
                        <div
                          className="mt-2 h-1.5 w-full rounded-full"
                          style={{ backgroundColor: "#CCCCCC" }}
                        >
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${Math.min((material.current / material.minimum) * 100, 100)}%`,
                              backgroundColor: "#FF6C6C",
                            }}
                          ></div>
                        </div>
                        <p
                          className="mt-1 text-xs"
                          style={{ color: "#7C7C7C" }}
                        >
                          공급업체: {material.supplier}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium whitespace-nowrap text-white transition-all duration-200 hover:bg-blue-700">
                <i className="ri-shopping-cart-line mr-2"></i>
                원자재 긴급 주문
              </button>
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div
          className="rounded-lg border shadow-sm"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E9EAEC" }}
        >
          <div className="border-b p-4" style={{ borderColor: "#E9EAEC" }}>
            <h2 className="text-lg font-semibold" style={{ color: "#17191B" }}>
              품질 관리 지표
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {qualityMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 text-center"
                  style={{ backgroundColor: "#F5F5F5" }}
                >
                  <p
                    className="mb-2 text-sm font-medium"
                    style={{ color: "#7C7C7C" }}
                  >
                    {metric.metric}
                  </p>
                  <p
                    className={`mb-1 text-2xl font-bold ${getQualityStatusColor(metric.status)}`}
                  >
                    {metric.value}
                  </p>
                  <p className="mb-2 text-xs" style={{ color: "#7C7C7C" }}>
                    목표: {metric.target}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        metric.status === "excellent"
                          ? "bg-green-500"
                          : metric.status === "good"
                            ? ""
                            : metric.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      }`}
                      style={
                        metric.status === "good"
                          ? { backgroundColor: "#8080FF" }
                          : {}
                      }
                    ></span>
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
