import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

// 생산 지시 데이터
const workOrderData = [
  {
    workOrderId: "WO-2024-001",
    productName: "엔진 어셈블리 A-Type",
    productCode: "PROD-001",
    requestedQty: 10,
    plannedQty: 10,
    completedQty: 0,
    requestDate: "2024-01-15",
    plannedStartDate: "2024-01-18",
    plannedEndDate: "2024-01-25",
    priority: "높음",
    status: "대기",
    bomVersion: "v2.1",
    productionLine: "LINE-A",
    assignedWorker: "박생산",
    estimatedHours: 56,
    materialAvailability: "부족",
  },
  {
    workOrderId: "WO-2024-002",
    productName: "브레이크 시스템",
    productCode: "PROD-002",
    requestedQty: 15,
    plannedQty: 15,
    completedQty: 8,
    requestDate: "2024-01-14",
    plannedStartDate: "2024-01-16",
    plannedEndDate: "2024-01-20",
    priority: "보통",
    status: "진행중",
    bomVersion: "v1.5",
    productionLine: "LINE-B",
    assignedWorker: "마구박아생산",
    estimatedHours: 45,
    materialAvailability: "충분",
  },
  {
    workOrderId: "WO-2024-003",
    productName: "전자제어 모듈",
    productCode: "PROD-003",
    requestedQty: 20,
    plannedQty: 20,
    completedQty: 20,
    requestDate: "2024-01-12",
    plannedStartDate: "2024-01-13",
    plannedEndDate: "2024-01-17",
    priority: "보통",
    status: "완료",
    bomVersion: "v3.0",
    productionLine: "LINE-C",
    assignedWorker: "박생산",
    estimatedHours: 32,
    materialAvailability: "충분",
  },
];

export const WorkOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [priorityFilter, setPriorityFilter] = useState("전체");

  // navItems를 별도로 정의
  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "대기", label: "대기" },
    { value: "진행중", label: "진행중" },
    { value: "완료", label: "완료" },
    { value: "중단", label: "중단" },
  ];

  const priorityOptions = [
    { value: "전체", label: "전체 우선순위" },
    { value: "높음", label: "높음" },
    { value: "보통", label: "보통" },
    { value: "낮음", label: "낮음" },
  ];

  const filteredData = workOrderData.filter((order) => {
    const matchesSearch =
      order.workOrderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || order.status === statusFilter;
    const matchesPriority =
      priorityFilter === "전체" || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStartProduction = (workOrderId: string) => {
    console.log("생산 시작:", workOrderId);
  };

  const handleViewDetails = (workOrderId: string) => {
    navigate(`/production/orders/${workOrderId}`);
  };

  const columns = [
    { key: "workOrderId", title: "생산지시번호", width: "130px" },
    { key: "productName", title: "제품명" },
    {
      key: "progress",
      title: "진행률",
      width: "120px",
      render: (value: any, row: any) => {
        const percentage = (row.completedQty / row.plannedQty) * 100;
        return (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-16 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600 dark:text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        );
      },
    },
    {
      key: "quantity",
      title: "수량",
      width: "100px",
      render: (value: any, row: any) => `${row.completedQty}/${row.plannedQty}`,
    },
    { key: "plannedEndDate", title: "완료예정일", width: "110px" },
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
        ): "info" | "warning" | "success" | "error" | "default" => {
          switch (status) {
            case "대기":
              return "info";
            case "진행중":
              return "warning";
            case "완료":
              return "success";
            case "중단":
              return "error";
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
      width: "150px",
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          {row.status === "대기" && row.materialAvailability === "충분" && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleStartProduction(row.workOrderId)}
            >
              시작
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetails(row.workOrderId)}
          >
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalOrders = workOrderData.length;
  const pendingOrders = workOrderData.filter(
    (order) => order.status === "대기",
  ).length;
  const inProgressOrders = workOrderData.filter(
    (order) => order.status === "진행중",
  ).length;
  const completedOrders = workOrderData.filter(
    (order) => order.status === "완료",
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          icon="ri-file-list-line"
          label="전체 지시"
          value={totalOrders}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-time-line"
          label="대기 중"
          value={pendingOrders}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          icon="ri-play-line"
          label="진행 중"
          value={inProgressOrders}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
        <StatCard
          icon="ri-check-line"
          label="완료"
          value={completedOrders}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="생산지시번호, 제품명 검색..."
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
            <Button variant="default" size="sm">
              <i className="ri-add-line mr-2"></i>
              신규 지시
            </Button>
            <Button variant="secondary" size="sm">
              <i className="ri-download-line mr-2"></i>
              내보내기
            </Button>
          </>
        }
      />

      {/* 생산 지시 목록 테이블 */}
      <TableSection
        title="생산 지시 목록"
        metaRight={
          <span className="text-sm text-gray-500">
            총 {filteredData.length}개 지시
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
          emptyText="조건에 맞는 생산지시가 없습니다"
        />
      </TableSection>
    </div>
  );
};
