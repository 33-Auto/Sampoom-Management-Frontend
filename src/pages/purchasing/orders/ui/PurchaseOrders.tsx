import React, { useState } from "react";
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
    const statusConfig = {
      draft: { label: "임시저장", color: "bg-gray-100 text-gray-800" },
      sent: { label: "발주됨", color: "bg-blue-100 text-blue-800" },
      confirmed: { label: "확인됨", color: "bg-purple-100 text-purple-800" },
      partial: { label: "부분입고", color: "bg-yellow-100 text-yellow-800" },
      completed: { label: "완료", color: "bg-green-100 text-green-800" },
      cancelled: { label: "취소됨", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* 요약 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">총 발주서</div>
          <div className="text-2xl font-bold text-gray-900">
            {summaryStats.total}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">임시저장</div>
          <div className="text-2xl font-bold text-gray-600">
            {summaryStats.draft}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">발주됨</div>
          <div className="text-2xl font-bold text-blue-600">
            {summaryStats.sent}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">확인됨</div>
          <div className="text-2xl font-bold text-purple-600">
            {summaryStats.confirmed}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-sm text-gray-500">총 발주금액</div>
          <div className="text-lg font-bold text-green-600">
            ₩{summaryStats.totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              placeholder="발주번호, 품목명, 공급업체로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="all">전체 상태</option>
              <option value="draft">임시저장</option>
              <option value="sent">발주됨</option>
              <option value="confirmed">확인됨</option>
              <option value="partial">부분입고</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소됨</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="all">전체 공급업체</option>
              {uniqueSuppliers.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>
          <button className="rounded-md bg-orange-600 px-4 py-2 whitespace-nowrap text-white transition-colors hover:bg-orange-700">
            새 발주서 생성
          </button>
        </div>
      </div>

      {/* 구매 주문 목록 */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
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
                      <button
                        onClick={() => handleGeneratePDF(order.id)}
                        className="rounded bg-gray-600 px-2 py-1 text-xs whitespace-nowrap text-white transition-colors hover:bg-gray-700"
                      >
                        PDF
                      </button>
                      {order.status === "draft" && (
                        <button
                          onClick={() => handleSendPO(order.id)}
                          className="rounded bg-orange-600 px-2 py-1 text-xs whitespace-nowrap text-white transition-colors hover:bg-orange-700"
                        >
                          발송
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
