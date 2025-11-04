import React, { useState } from "react";

import {
  Badge,
  Button,
  SearchFilterBar,
  StatCard,
  TableSection,
} from "@/shared/ui";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  itemCode: string;
  itemName: string;
  orderedQuantity: number;
  unitPrice: number;
  totalAmount: number;
  unit: string;
  orderDate: string;
  expectedDate: string;
  status:
    | "draft"
    | "sent"
    | "confirmed"
    | "partial"
    | "completed"
    | "cancelled";
  relatedPR: string;
}

export const PurchaseOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");

  // 네비게이션 아이템
  // 헤더 설정
  // 구매 주문 목록 데이터
  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "PO001",
      poNumber: "PO-2024-001",
      supplierName: "한국금속공업",
      itemCode: "RM-AL-001",
      itemName: "알루미늄 합금",
      orderedQuantity: 100,
      unitPrice: 15000,
      totalAmount: 1500000,
      unit: "KG",
      orderDate: "2024-01-15",
      expectedDate: "2024-01-18",
      status: "sent",
      relatedPR: "PR-2024-001",
    },
    {
      id: "PO002",
      poNumber: "PO-2024-002",
      supplierName: "대한고무산업",
      itemCode: "RM-RUB-001",
      itemName: "고무 시일링",
      orderedQuantity: 200,
      unitPrice: 2500,
      totalAmount: 500000,
      unit: "EA",
      orderDate: "2024-01-15",
      expectedDate: "2024-01-17",
      status: "confirmed",
      relatedPR: "PR-2024-002",
    },
    {
      id: "PO003",
      poNumber: "PO-2024-003",
      supplierName: "스틸테크",
      itemCode: "RM-STE-001",
      itemName: "스테인리스 스틸",
      orderedQuantity: 50,
      unitPrice: 25000,
      totalAmount: 1250000,
      unit: "KG",
      orderDate: "2024-01-14",
      expectedDate: "2024-01-19",
      status: "partial",
      relatedPR: "PR-2024-003",
    },
    {
      id: "PO004",
      poNumber: "PO-2024-004",
      supplierName: "정밀베어링",
      itemCode: "CP-BEA-001",
      itemName: "베어링",
      orderedQuantity: 30,
      unitPrice: 45000,
      totalAmount: 1350000,
      unit: "EA",
      orderDate: "2024-01-13",
      expectedDate: "2024-01-20",
      status: "completed",
      relatedPR: "PR-2024-004",
    },
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string;
        variant:
          | "default"
          | "info"
          | "purple"
          | "warning"
          | "success"
          | "error";
      }
    > = {
      draft: { label: "임시저장", variant: "default" },
      sent: { label: "발주됨", variant: "info" },
      confirmed: { label: "확인됨", variant: "purple" },
      partial: { label: "부분입고", variant: "warning" },
      completed: { label: "완료", variant: "success" },
      cancelled: { label: "취소됨", variant: "error" },
    };

    const config = statusConfig[status];
    if (!config) return null;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleGeneratePDF = (poId: string) => {
    alert(`발주서 PDF가 생성되었습니다: ${poId}`);
  };

  const handleSendPO = (poId: string) => {
    alert(`발주서가 공급업체에 전송되었습니다: ${poId}`);
  };

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSupplier =
      supplierFilter === "all" || order.supplierName === supplierFilter;
    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const summaryStats = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter((order) => order.status === "draft").length,
    sent: purchaseOrders.filter((order) => order.status === "sent").length,
    confirmed: purchaseOrders.filter((order) => order.status === "confirmed")
      .length,
    totalAmount: purchaseOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    ),
  };

  const uniqueSuppliers = [
    ...new Set(purchaseOrders.map((order) => order.supplierName)),
  ];

  const statusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "draft", label: "임시저장" },
    { value: "sent", label: "발주됨" },
    { value: "confirmed", label: "확인됨" },
    { value: "partial", label: "부분입고" },
    { value: "completed", label: "완료" },
    { value: "cancelled", label: "취소됨" },
  ];

  const supplierOptions = [
    { value: "all", label: "전체 공급업체" },
    ...uniqueSuppliers.map((supplier) => ({
      value: supplier,
      label: supplier,
    })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-5">
        <StatCard
          icon="ri-file-list-line"
          label="총 발주서"
          value={summaryStats.total}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-file-edit-line"
          label="임시저장"
          value={summaryStats.draft}
          iconBgColor="bg-gray-100"
          iconColor="text-gray-600"
        />
        <StatCard
          icon="ri-send-plane-line"
          label="발주됨"
          value={summaryStats.sent}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon="ri-check-double-line"
          label="확인됨"
          value={summaryStats.confirmed}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          icon="ri-money-dollar-circle-line"
          label="총 발주금액"
          value={`₩${summaryStats.totalAmount.toLocaleString()}`}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* 필터 및 검색 */}
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="발주번호, 품목명, 공급업체로 검색..."
        filters={[
          {
            key: "status",
            value: statusFilter,
            options: statusOptions,
            onChange: setStatusFilter,
          },
          {
            key: "supplier",
            value: supplierFilter,
            options: supplierOptions,
            onChange: setSupplierFilter,
          },
        ]}
        actions={
          <Button variant="default" size="sm">
            새 발주서 생성
          </Button>
        }
      />

      {/* 구매 주문 목록 */}
      <TableSection title="구매 주문 목록">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  발주 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  공급업체
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  품목 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  수량 / 단가
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  총액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  일정
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.poNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        연관: {order.relatedPR}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.supplierName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.itemName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.itemCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {order.orderedQuantity.toLocaleString()} {order.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₩{order.unitPrice.toLocaleString()} / {order.unit}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₩{order.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        발주: {order.orderDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        예정: {order.expectedDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGeneratePDF(order.id)}
                      >
                        PDF
                      </Button>
                      {order.status === "draft" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSendPO(order.id)}
                        >
                          발송
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableSection>
    </div>
  );
};
