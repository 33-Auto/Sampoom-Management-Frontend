import { useState } from "react";
import { useLoaderData } from "react-router-dom";

import type { OrderResDto } from "@/shared/api/models";
import { Button, Table } from "@/shared/ui";

export default function WarehouseOrdersPage() {
  const { orders: ordersPromise } = useLoaderData() as {
    orders: Promise<{ data: OrderResDto[] }>;
  };
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("current");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-main-100 text-main-800";
      case "SHIPPING":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-grey-100 text-grey-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "승인 대기";
      case "CONFIRMED":
        return "승인됨";
      case "SHIPPING":
        return "배송중";
      case "COMPLETED":
        return "배송완료";
      case "CANCELED":
        return "취소됨";
      default:
        return status;
    }
  };

  const handleApproveOrder = (orderId: string) => {
    alert(`주문 ${orderId}이(가) 승인되었습니다.`);
  };

  const handleRejectOrder = (orderId: string) => {
    alert(`주문 ${orderId}이(가) 거부되었습니다.`);
  };

  const columns = [
    { key: "id", title: "주문 ID" },
    { key: "branch", title: "지점명" },
    {
      key: "status",
      title: "상태",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            value,
          )}`}
        >
          {getStatusText(value)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "작업",
      render: (_: any, row: any) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSelectedOrder(row)}
        >
          상세보기
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 탭들 */}
      <div className="mb-6">
        <div className="flex w-fit space-x-1 rounded-lg bg-grey-100 p-1 transition-colors duration-200 dark:bg-grey-800">
          <button
            onClick={() => setActiveTab("current")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "current"
                ? "bg-main-500 text-white"
                : "text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
            }`}
          >
            현재 주문
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "bg-main-500 text-white"
                : "text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
            }`}
          >
            주문 이력
          </button>
        </div>
      </div>

      {/* 주문 목록 테이블 */}
      <div className="rounded-xl border border-grey-100 bg-bg-card-white shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
        <div className="border-b border-grey-100 p-6 dark:border-grey-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-grey-500 dark:text-grey-100">
              주문 목록
            </h3>
            <div className="text-sm text-grey-500 dark:text-grey-300">
              주문 목록
            </div>
          </div>
        </div>
        <Table dataPromise={ordersPromise} columns={columns} />
      </div>

      {/* 주문 목록 테이블 모달 */}
      {selectedOrder && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                주문 상세정보
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-grey-500 dark:text-grey-300">
                    주문 ID
                  </p>
                  <p className="font-medium text-grey-500 dark:text-grey-100">
                    {selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-grey-500 dark:text-grey-300">
                    지점명
                  </p>
                  <p className="font-medium text-grey-500 dark:text-grey-100">
                    {selectedOrder.branch}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-grey-500 dark:text-grey-300">
                    상태
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      selectedOrder.status,
                    )}`}
                  >
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-lg font-semibold text-grey-500 dark:text-grey-100">
                주문 부품
              </h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black"
                  >
                    <div>
                      <p className="font-medium text-grey-500 dark:text-grey-100">
                        {item.code}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-grey-500 dark:text-grey-100">
                        {item.quantity}개
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.status === "PENDING" && (
              <div className="flex space-x-3">
                <Button
                  variant="default"
                  onClick={() => handleApproveOrder(selectedOrder.id)}
                >
                  주문 승인
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleRejectOrder(selectedOrder.id)}
                >
                  주문 거부
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
