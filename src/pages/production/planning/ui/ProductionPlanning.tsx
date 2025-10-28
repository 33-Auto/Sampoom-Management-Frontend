import { useState } from "react";

import { Button, Input, Select, Table } from "@/shared/ui";

// MRP 계획 데이터
const mrpPlanData = [
  {
    planId: "MRP-2024-001",
    itemCode: "PROD-001",
    itemName: "엔진 어셈블리 A-Type",
    currentStock: 45,
    safetyStock: 20,
    reorderPoint: 60,
    demandForecast: 80,
    plannedProduction: 100,
    plannedDate: "2024-01-25",
    priority: "높음",
    status: "계획확정",
    leadTime: 7,
    bomRequired: true,
    materialAvailability: "부족",
  },
  {
    planId: "MRP-2024-002",
    itemCode: "PROD-002",
    itemName: "브레이크 시스템",
    currentStock: 15,
    safetyStock: 25,
    reorderPoint: 40,
    demandForecast: 60,
    plannedProduction: 80,
    plannedDate: "2024-01-28",
    priority: "보통",
    status: "검토중",
    leadTime: 5,
    bomRequired: true,
    materialAvailability: "충분",
  },
  {
    planId: "MRP-2024-003",
    itemCode: "MAT-001",
    itemName: "알루미늄 합금 판재",
    currentStock: 120,
    safetyStock: 50,
    reorderPoint: 80,
    demandForecast: 200,
    plannedProduction: 0,
    plannedDate: "2024-01-30",
    priority: "높음",
    status: "구매요청",
    leadTime: 3,
    bomRequired: false,
    materialAvailability: "구매필요",
  },
];

export const ProductionPlanning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [priorityFilter, setPriorityFilter] = useState("전체");

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "계획확정", label: "계획확정" },
    { value: "검토중", label: "검토중" },
    { value: "구매요청", label: "구매요청" },
    { value: "보류", label: "보류" },
  ];

  const priorityOptions = [
    { value: "전체", label: "전체 우선순위" },
    { value: "높음", label: "높음" },
    { value: "보통", label: "보통" },
    { value: "낮음", label: "낮음" },
  ];

  const filteredData = mrpPlanData.filter((plan) => {
    const matchesSearch =
      plan.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.itemName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || plan.status === statusFilter;
    const matchesPriority =
      priorityFilter === "전체" || plan.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // MRP 핵심 기능: 생산 요청 결정
  const handleCreateProductionOrder = (planId: string) => {
    console.log("생산 지시 생성:", planId);
    // 생산 지시서 생성 및 MES로 전송
  };

  const handleCreatePurchaseRequest = (planId: string) => {
    console.log("구매 요청 생성:", planId);
    // 구매 요청서 생성 및 구매 모듈로 전송
  };

  const handleRunMRP = () => {
    console.log("MRP 실행");
    // 전체 MRP 계산 실행
  };

  const columns = [
    { key: "planId", title: "계획번호", width: "130px" },
    { key: "itemName", title: "품목명" },
    {
      key: "stockStatus",
      title: "재고현황",
      width: "120px",
      render: (value: any, row: any) => (
        <div className="text-xs">
          <div>현재: {row.currentStock}</div>
          <div className="text-gray-500">ROP: {row.reorderPoint}</div>
        </div>
      ),
    },
    {
      key: "demandForecast",
      title: "수요예측",
      width: "100px",
      render: (value: number) => `${value}개`,
    },
    {
      key: "plannedProduction",
      title: "계획생산",
      width: "100px",
      render: (value: number) => (value > 0 ? `${value}개` : "-"),
    },
    { key: "plannedDate", title: "계획일자", width: "110px" },
    {
      key: "priority",
      title: "우선순위",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "높음"
              ? "bg-red-101 text-red-800"
              : value === "보통"
                ? "bg-yellow-101 text-yellow-800"
                : "bg-green-101 text-green-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "materialAvailability",
      title: "자재가용성",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "충분"
              ? "bg-green-101 text-green-800"
              : value === "부족"
                ? "bg-red-101 text-red-800"
                : value === "구매필요"
                  ? "bg-orange-101 text-orange-800"
                  : "bg-yellow-101 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "계획확정"
              ? "bg-green-101 text-green-800"
              : value === "검토중"
                ? "bg-yellow-101 text-yellow-800"
                : value === "구매요청"
                  ? "bg-blue-101 text-blue-800"
                  : "bg-gray-101 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "작업",
      width: "180px",
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          {row.status === "계획확정" && row.plannedProduction > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleCreateProductionOrder(row.planId)}
            >
              생산지시
            </Button>
          )}
          {row.status === "구매요청" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCreatePurchaseRequest(row.planId)}
            >
              구매요청
            </Button>
          )}
          <Button variant="secondary" size="sm">
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalPlans = mrpPlanData.length;
  const confirmedPlans = mrpPlanData.filter(
    (plan) => plan.status === "계획확정",
  ).length;
  const reviewingPlans = mrpPlanData.filter(
    (plan) => plan.status === "검토중",
  ).length;
  const purchaseRequests = mrpPlanData.filter(
    (plan) => plan.status === "구매요청",
  ).length;

  return (
    <>
      {/* 메인 컨텐츠 */}
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <i className="ri-file-list-line text-xl text-blue-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">전체 계획</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <i className="ri-check-line text-xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">확정 계획</p>
              <p className="text-2xl font-bold text-gray-900">
                {confirmedPlans}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <i className="ri-time-line text-xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">검토 중</p>
              <p className="text-2xl font-bold text-gray-900">
                {reviewingPlans}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <i className="ri-shopping-cart-line text-xl text-orange-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">구매 요청</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchaseRequests}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MRP 실행 및 필터 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Input
            placeholder="계획번호, 품목명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={priorityOptions}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          />
          <Button variant="default" size="sm" onClick={handleRunMRP}>
            <i className="ri-play-line mr-2"></i>
            MRP 실행
          </Button>
          <Button variant="secondary" size="sm">
            <i className="ri-download-line mr-2"></i>
            내보내기
          </Button>
        </div>
      </div>

      {/* MRP 계획 목록 테이블 */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              MRP 계획 목록
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                총 {filteredData.length}개 계획
              </span>
              <Button variant="secondary" size="sm">
                <i className="ri-refresh-line mr-2"></i>
                새로고침
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <Table
            columns={columns}
            data={filteredData}
            emptyText="조건에 맞는 계획이 없습니다"
          />
        </div>
      </div>

      {/* MRP 시스템 역할 안내 */}
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-start space-x-3">
          <i className="ri-lightbulb-line mt-0.5 text-lg text-green-600"></i>
          <div>
            <h3 className="text-sm font-medium text-green-900">
              MRP (자재 소요 계획) 시스템 역할
            </h3>
            <p className="mt-1 text-sm text-green-700">
              MRP는 WMS로부터 재고 변경 이벤트를 받아 재주문점 분석을 수행하고,
              생산 계획을 수립하여 생산 지시 및 구매 요청을 결정하는 '두뇌'
              역할을 담당합니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
