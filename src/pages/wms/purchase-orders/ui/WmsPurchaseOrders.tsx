import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Table,
  StatCard,
  InfoBox,
  SearchFilterBar,
  TableSection,
} from "@/shared/ui";

// 발주 관리 데이터
const purchaseOrders = [
  {
    id: "PO-2024-001",
    poNumber: "PO-2024-001",
    itemCode: "RM-AL-001",
    itemName: "알루미늄 합금 판재",
    supplier: "한국금속공업",
    category: "안전",
    group: "제동",
    orderedQty: 500,
    receivedQty: 0,
    unit: "KG",
    totalAmount: 7500000,
    orderDate: "2024-01-20",
    expectedDate: "2024-01-25",
    status: "auto_approved",
    creationType: "auto",
    ropTriggered: true,
    currentStock: 45,
    reorderPoint: 50,
    autoProcessed: true,
    processedAt: "2024-01-20",
  },
  {
    id: "PO-2024-002",
    poNumber: "PO-2024-002",
    itemCode: "RM-ST-002",
    itemName: "스테인리스 스틸 봉재",
    supplier: "대한철강",
    category: "기계",
    group: "동력전달",
    orderedQty: 200,
    receivedQty: 200,
    unit: "KG",
    totalAmount: 3200000,
    orderDate: "2024-01-18",
    expectedDate: "2024-01-23",
    status: "completed",
    creationType: "auto",
    ropTriggered: true,
    currentStock: 180,
    reorderPoint: 100,
    autoProcessed: true,
    processedAt: "2024-01-18",
  },
  {
    id: "PO-2024-003",
    poNumber: "PO-2024-003",
    itemCode: "RM-PL-003",
    itemName: "플라스틱 원료",
    supplier: "케미칼코리아",
    category: "플라스틱",
    group: "외장재",
    orderedQty: 1000,
    receivedQty: 0,
    unit: "KG",
    totalAmount: 2500000,
    orderDate: "2024-01-19",
    expectedDate: "2024-01-26",
    status: "rejected",
    creationType: "manual",
    ropTriggered: false,
    currentStock: 250,
    reorderPoint: 300,
    autoProcessed: false,
    processedAt: "2024-01-19",
  },
  {
    id: "PO-2024-004",
    poNumber: "PO-2024-004",
    itemCode: "RM-RU-004",
    itemName: "고무 시트",
    supplier: "한국고무",
    category: "시트",
    group: "시트",
    orderedQty: 150,
    receivedQty: 0,
    unit: "EA",
    totalAmount: 1800000,
    orderDate: "2024-01-21",
    expectedDate: "2024-01-28",
    status: "auto_approved",
    creationType: "auto",
    ropTriggered: true,
    currentStock: 25,
    reorderPoint: 30,
    autoProcessed: true,
    processedAt: "2024-01-21",
  },
  {
    id: "PO-2024-005",
    poNumber: "PO-2024-005",
    itemCode: "RM-GL-005",
    itemName: "강화유리",
    supplier: "유리공업사",
    category: "전자",
    group: "제어",
    orderedQty: 80,
    receivedQty: 80,
    unit: "EA",
    totalAmount: 4800000,
    orderDate: "2024-01-17",
    expectedDate: "2024-01-22",
    status: "completed",
    creationType: "manual",
    ropTriggered: false,
    currentStock: 120,
    reorderPoint: 50,
    autoProcessed: false,
    processedAt: "2024-01-17",
  },
];

export function WmsPurchaseOrders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCreation, setSelectedCreation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedGroup, setSelectedGroup] = useState("전체");

  const categoryOptions = [
    { value: "전체", label: "전체 카테고리" },
    { value: "안전", label: "안전" },
    { value: "섀시", label: "섀시" },
    { value: "기계", label: "기계" },
    { value: "전기", label: "전기" },
    { value: "내장", label: "내장" },
    { value: "플라스틱", label: "플라스틱" },
    { value: "전자", label: "전자" },
  ];

  const groupOptions = [
    { value: "전체", label: "전체 그룹" },
    { value: "제동", label: "제동" },
    { value: "현가장치", label: "현가장치" },
    { value: "동력전달", label: "동력전달" },
    { value: "조명", label: "조명" },
    { value: "시트", label: "시트" },
    { value: "외장재", label: "외장재" },
    { value: "제어", label: "제어" },
  ];

  const statusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "auto_approved", label: "자동 승인" },
    { value: "completed", label: "입고 완료" },
    { value: "rejected", label: "반려" },
  ];

  const creationTypeOptions = [
    { value: "all", label: "전체 생성구분" },
    { value: "auto", label: "자동 생성" },
    { value: "manual", label: "수동 생성" },
  ];

  const filteredData = purchaseOrders.filter((item) => {
    const matchesSearch =
      item.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체" || item.category === selectedCategory;
    const matchesGroup =
      selectedGroup === "전체" || item.group === selectedGroup;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCreationType =
      selectedCreation === "all" || item.creationType === selectedCreation;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory &&
      matchesGroup &&
      matchesCreationType
    );
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      auto_approved: {
        label: "자동 승인",
        color:
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-600",
      },
      completed: {
        label: "입고 완료",
        color:
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-600",
      },
      rejected: {
        label: "반려",
        color:
          "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-600",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span
        className={`rounded-full border px-3 py-1 text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleViewDetails = (poNumber: string) => {
    navigate(`/wms/purchase-orders/detail/${poNumber}`);
  };

  const columns = [
    {
      key: "poNumber",
      title: "발주번호",
      width: "120px",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-grey-100">
            {value}
          </div>
          {row.ropTriggered && (
            <div className="text-xs text-purple-600 dark:text-purple-400">
              ROP 트리거
            </div>
          )}
          {row.autoProcessed && (
            <div className="text-xs text-green-600 dark:text-green-400">
              자동 처리
            </div>
          )}
        </div>
      ),
    },
    {
      key: "itemName",
      title: "품목명",
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-grey-100">
            {value}
          </div>
          <div className="text-sm text-gray-500 dark:text-grey-300">
            {row.itemCode}
          </div>
          <div className="text-xs text-gray-400 dark:text-grey-400">
            현재: {row.currentStock} / ROP: {row.reorderPoint}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      title: "카테고리",
      width: "250px",
      render: (_: any, row: any) => `${row.category} > ${row.group}`,
    },
    {
      key: "orderedQty",
      title: "발주수량",
      width: "100px",
      render: (value: number, row: any) =>
        `${value.toLocaleString()} ${row.unit}`,
    },
    {
      key: "receivedQty",
      title: "입고수량",
      width: "100px",
      render: (value: number, row: any) => (
        <span
          className={
            value > 0
              ? "font-medium text-green-600 dark:text-green-400"
              : "text-gray-500 dark:text-grey-300"
          }
        >
          {value.toLocaleString()} {row.unit}
        </span>
      ),
    },
    {
      key: "pendingQty",
      title: "미입고수량",
      width: "100px",
      render: (value: number, row: any) => {
        const pendingQty = row.orderedQty - row.receivedQty;
        return (
          <span
            className={
              pendingQty > 0
                ? "font-medium text-orange-600 dark:text-orange-400"
                : "text-gray-500 dark:text-grey-300"
            }
          >
            {pendingQty.toLocaleString()} {row.unit}
          </span>
        );
      },
    },
    {
      key: "totalAmount",
      title: "발주금액",
      width: "120px",
      render: (value: number) => `₩${value.toLocaleString()}`,
    },
    {
      key: "processedAt",
      title: "처리일",
      width: "100px",
      render: (value: string | null) => (
        <div>
          {value ? (
            <div className="text-sm text-gray-900 dark:text-grey-100">
              {value}
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-grey-300">-</div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "actions",
      title: "작업",
      width: "100px",
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleViewDetails(row.poNumber)}
          >
            상세
          </Button>
        </div>
      ),
    },
  ];

  // 통계 계산
  const autoApproved = purchaseOrders.filter(
    (item) => item.status === "auto_approved",
  ).length;
  const rejected = purchaseOrders.filter(
    (item) => item.status === "rejected",
  ).length;
  const autoProcessedCount = purchaseOrders.filter(
    (item) => item.autoProcessed,
  ).length;

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 자동화 현황 대시보드 */}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-check-line"
            label="자동 처리율"
            value={94.2}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            icon="ri-check-line"
            label="자동 승인"
            value={autoApproved}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-close-line"
            label="반려"
            value={rejected}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <StatCard
            icon="ri-money-dollar-circle-line"
            label="총 발주액"
            value={94.2}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        {/* 실시간 모니터링 알림 */}
        <InfoBox
          type="success"
          title="실시간 자동 발주 모니터링"
          children={
            <div className="flex-1">
              <p className="mt-1 text-sm text-green-700">
                시스템이 ROP 기반으로 자동 발주를 처리하고 있습니다.
                <span className="font-medium">오늘 {autoProcessedCount}건</span>
                이 자동 처리되었습니다.
              </p>
              <div className="mt-2 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                  <span className="text-xs text-green-600">자동 처리 활성</span>
                </div>
                <div className="text-xs text-gray-500">
                  마지막 업데이트: 방금 전
                </div>
              </div>
            </div>
          }
        />

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="발주번호, 품목명, 공급업체 검색..."
          filters={[
            {
              key: "category",
              value: selectedCategory,
              options: categoryOptions,
              onChange: setSelectedCategory,
            },
            {
              key: "group",
              value: selectedGroup,
              options: groupOptions,
              onChange: setSelectedGroup,
            },
            {
              key: "status",
              value: statusFilter,
              options: statusOptions,
              onChange: setStatusFilter,
            },
            {
              key: "creation",
              value: selectedCreation,
              options: creationTypeOptions,
              onChange: setSelectedCreation,
            },
          ]}
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("전체");
                setSelectedGroup("전체");
                setStatusFilter("all");
                setSelectedCreation("all");
              }}
            >
              <i className="ri-refresh-line mr-2"></i>
              초기화
            </Button>
          }
        />

        {/* 발주 모니터링 테이블 */}

        <TableSection
          title="자동 발주 모니터링"
          metaRight={
            <span className="text-sm text-gray-500">총 100000개 입고건</span>
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
            emptyText="조건에 맞는 발주서가 없습니다"
          />
        </TableSection>
      </div>
    </>
  );
}
