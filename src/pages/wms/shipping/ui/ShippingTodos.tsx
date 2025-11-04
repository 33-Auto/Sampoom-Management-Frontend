import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { queryClient as tanstackQueryClient } from "@/shared/api/query";
import {
  Badge,
  Button,
  SearchFilterBar,
  StatCard,
  Table,
  TableSection,
} from "@/shared/ui";

import { shippingListQueryOptions } from "../api/order.api";
import type { ShippingListResponse } from "../model/shipping.model";
// 출고 지시 데이터
const shippingTodoData = [
  {
    shippingId: "SH-2024-001",
    orderId: "SO-2024-001",
    orderDate: "2024-01-15",
    customerName: "서울대리점",
    productName: "엔진 어셈블리 A-Type",
    productCode: "PROD-001",
    requestedQty: 5,
    availableStock: 3,
    warehouseLocation: "A-01-05",
    priority: "높음",
    requestedDate: "2024-01-20",
    status: "출고대기",
    warehouseManager: "김창고",
  },
  {
    shippingId: "SH-2024-002",
    orderId: "SO-2024-002",
    orderDate: "2024-01-15",
    customerName: "부산대리점",
    productName: "브레이크 시스템",
    productCode: "PROD-002",
    requestedQty: 10,
    availableStock: 15,
    warehouseLocation: "B-02-03",
    priority: "보통",
    requestedDate: "2024-01-22",
    status: "출고대기",
    warehouseManager: "이창고",
  },
  {
    shippingId: "SH-2024-003",
    orderId: "SO-2024-003",
    orderDate: "2024-01-14",
    customerName: "대구대리점",
    productName: "전자제어 모듈",
    productCode: "PROD-003",
    requestedQty: 8,
    availableStock: 2,
    warehouseLocation: "C-01-02",
    priority: "높음",
    requestedDate: "2024-01-18",
    status: "재고부족",
    warehouseManager: "박창고",
  },
];

export const ShippingTodos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [priorityFilter, setPriorityFilter] = useState("전체");

  const [page, setPage] = useState(0);

  // loader로 불러진 데이터 사용하기
  const { data, isFetching } = useQuery(
    shippingListQueryOptions({ page: page }),
  ) as { data: ShippingListResponse; isFetching: boolean };

  // const shippingList: PartResDto[] = data?.data?.content || [];

  const handleNextPage = () => {
    setPage(page + 1);
    tanstackQueryClient.prefetchQuery(
      shippingListQueryOptions({ page: page + 2 }),
    );
  };

  const statusOptions = [
    { value: "전체", label: "전체 상태" },
    { value: "출고대기", label: "출고대기" },
    { value: "출고진행", label: "출고진행" },
    { value: "출고완료", label: "출고완료" },
    { value: "재고부족", label: "재고부족" },
  ];

  const priorityOptions = [
    { value: "전체", label: "전체 우선순위" },
    { value: "높음", label: "높음" },
    { value: "보통", label: "보통" },
    { value: "낮음", label: "낮음" },
  ];

  const filteredData = shippingTodoData.filter((item) => {
    const matchesSearch =
      item.shippingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "전체" || item.status === statusFilter;
    const matchesPriority =
      priorityFilter === "전체" || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleShipConfirm = (shippingId: string) => {
    console.log("출고 확정:", shippingId);
  };

  // 생산 요청 기능 제거 - WMS는 보고만 담당
  // const handleStockAlert = (shippingId: string) => {
  //   console.log("재고 부족 알림 전송:", shippingId);
  //   // ERP 시스템으로 재고 부족 이벤트 전송
  // };

  const columns = [
    // { key: "id", title: "출고번호", width: "120px" },
    { key: "code", title: "주문번호", width: "120px" },
    { key: "name", title: "제품명" },
    {
      key: "requestedQty",
      title: "요청수량",
      width: "80px",
      render: (value: number) => `${value}개`,
    },
    {
      key: "unit",
      title: "단위",
      width: "80px",
    },
    {
      key: "availableStock",
      title: "가용재고",
      width: "80px",
      render: (value: number, row: any) => (
        <span
          className={
            value >= row.requestedQty ? "text-green-600" : "text-red-600"
          }
        >
          {value}개
        </span>
      ),
    },
    {
      key: "status",
      title: "상태",
      width: "100px",
      render: (value: string) => (
        <Badge
          variant={
            value === "출고대기"
              ? "info"
              : value === "출고진행"
                ? "warning"
                : value === "출고완료"
                  ? "success"
                  : "error"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "작업",
      width: "180px",
      render: (value: any, row: any) => (
        <div className="flex space-x-1">
          {row.status === "출고대기" &&
            row.availableStock >= row.requestedQty && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleShipConfirm(row.shippingId)}
              >
                출고확정
              </Button>
            )}
          {/* {row.status === "재고부족" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStockAlert(row.shippingId)}
            >
              재고알림
            </Button>
          )}
          <Button variant="secondary" size="sm">
            상세
          </Button> */}
        </div>
      ),
    },
  ];

  // 통계 계산
  const totalShipping = shippingTodoData.length;
  const pendingShipping = shippingTodoData.filter(
    (item) => item.status === "출고대기",
  ).length;
  const stockShortage = shippingTodoData.filter(
    (item) => item.status === "재고부족",
  ).length;
  const urgentShipping = shippingTodoData.filter(
    (item) => item.priority === "높음",
  ).length;

  return (
    <>
      {/* 메인 컨텐츠 */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 통계 카드 */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            icon="ri-truck-line"
            label="전체 출고지시"
            value={totalShipping}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon="ri-time-line"
            label="출고 대기"
            value={pendingShipping}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon="ri-alert-line"
            label="재고 부족"
            value={stockShortage}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
          <StatCard
            icon="ri-fire-line"
            label="긴급 출고"
            value={urgentShipping}
            iconBgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
        </div>

        {/* 필터 및 검색 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="출고번호, 주문번호, 고객사 검색..."
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
            <div className="flex space-x-2">
              <Button variant="default" size="sm" onClick={handleNextPage}>
                <i className="ri1-add-line mr-2"></i>
                수동 출고
              </Button>
            </div>
          }
        />

        {/* 출고 지시 목록 테이블 */}
        <TableSection
          title="출고 지시 목록"
          metaRight={
            <span className="text-sm text-gray-500">
              총 {filteredData.length}개 출고지시
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
            data={data?.data?.content || []}
            emptyText="조건에 맞는 출고지시가 없습니다"
            loading={isFetching}
          />
        </TableSection>
      </div>
    </>
  );
};
