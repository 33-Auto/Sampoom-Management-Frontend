import { useState } from "react";

import {
  Badge,
  Button,
  InfoBox,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

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
      render: (value: string) => {
        const getPriorityVariant = (
          priority: string,
        ): "error" | "warning" | "success" | "default" => {
          switch (priority) {
            case "높음":
              return "error";
            case "보통":
              return "warning";
            case "낮음":
              return "success";
            default:
              return "default";
          }
        };
        return <Badge variant={getPriorityVariant(value)}>{value}</Badge>;
      },
    },
    {
      key: "materialAvailability",
      title: "자재가용성",
      width: "100px",
      render: (value: string) => {
        const getAvailabilityVariant = (
          availability: string,
        ): "success" | "error" | "warning" => {
          switch (availability) {
            case "충분":
              return "success";
            case "부족":
              return "error";
            case "구매필요":
              return "warning";
            default:
              return "warning";
          }
        };
        return <Badge variant={getAvailabilityVariant(value)}>{value}</Badge>;
      },
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => {
        const getStatusVariant = (
          status: string,
        ): "success" | "warning" | "info" | "default" => {
          switch (status) {
            case "계획확정":
              return "success";
            case "검토중":
              return "warning";
            case "구매요청":
              return "info";
            case "보류":
              return "default";
            default:
              return "default";
          }
        };
        return <Badge variant={getStatusVariant(value)}>{value}</Badge>;
      },
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
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-file-list-line"
          label="전체 계획"
          value={totalPlans}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-check-line"
          label="확정 계획"
          value={confirmedPlans}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon="ri-time-line"
          label="검토 중"
          value={reviewingPlans}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-shopping-cart-line"
          label="구매 요청"
          value={purchaseRequests}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* MRP 실행 및 필터 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="계획번호, 품목명 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
          {
            key: "priority",
            value: priorityFilter,
            options: priorityOptions,
            onChange: setPriorityFilter,
          },
        ]}
        actions={
          <>
            <Button variant="default" size="sm" onClick={handleRunMRP}>
              <i className="ri-play-line mr-2"></i>
              MRP 실행
            </Button>
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
          </>
        }
      />

      {/* MRP 계획 목록 테이블 */}
      <TableSection
        title="MRP 계획 목록"
        metaRight={
          <span className="text-sm text-gray-500">
            총 {filteredData.length}개 계획
          </span>
        }
        actionsRight={
          <Button variant="secondary" size="sm">
            <i className="ri-refresh-line mr-2"></i>
            새로고침
          </Button>
        }
      >
        <Table
          columns={columns}
          data={filteredData}
          emptyText="조건에 맞는 계획이 없습니다"
        />
      </TableSection>

      {/* MRP 시스템 역할 안내 */}
      <InfoBox
        type="success"
        title="MRP (자재 소요 계획) 시스템 역할"
        className="mt-6"
      >
        <p>
          MRP는 WMS로부터 재고 변경 이벤트를 받아 재주문점 분석을 수행하고, 생산
          계획을 수립하여 생산 지시 및 구매 요청을 결정하는 '두뇌' 역할을
          담당합니다.
        </p>
      </InfoBox>
    </div>
  );
};
