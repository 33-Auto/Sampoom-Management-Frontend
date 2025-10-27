import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Select } from "@/shared/ui";
import { Table } from "@/shared/ui";

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
    assignedWorker: "김생산",
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
    assignedWorker: "이생산",
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

export default function WorkOrders() {
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
            <span className="text-xs text-gray-600">
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
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "높음"
              ? "bg-red-100 text-red-800"
              : value === "보통"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
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
              ? "bg-green-100 text-green-800"
              : value === "부족"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
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
            value === "대기"
              ? "bg-blue-100 text-blue-800"
              : value === "진행중"
                ? "bg-yellow-100 text-yellow-800"
                : value === "완료"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
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
                <p className="text-sm font-medium text-gray-600">전체 지시</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalOrders}
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
                <p className="text-sm font-medium text-gray-600">대기 중</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <i className="ri-play-line text-xl text-orange-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">진행 중</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inProgressOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <i className="ri-check-line text-xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">완료</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedOrders}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              placeholder="생산지시번호, 제품명 검색..."
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
            <div className="flex space-x-2">
              <Button variant="default" size="sm">
                <i className="ri-add-line mr-2"></i>
                신규 지시
              </Button>
              <Button variant="secondary" size="sm">
                <i className="ri-download-line mr-2"></i>
                내보내기
              </Button>
            </div>
          </div>
        </div>

        {/* 생산 지시 목록 테이블 */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                생산 지시 목록
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  총 {filteredData.length}개 지시
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
              emptyText="조건에 맞는 생산지시가 없습니다"
            />
          </div>
      </div>
    </>
  );
}
