import { useState } from "react";

import { factoryOrders, billOfMaterials, rawMaterials } from "@/../mocks";
import { factorySidebarItems } from "@/shared/config/sidebar";
import { Button, Table } from "@/shared/ui";
import { PageLayout } from "@/widgets/Layout";

const FactoryOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showBOM, setShowBOM] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("current");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Production":
        return "bg-main-100 text-main-800";
      case "Shipped":
        return "bg-green-100 text-green-800";
      default:
        return "bg-grey-100 text-grey-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "승인 대기";
      case "In Production":
        return "생산중";
      case "Shipped":
        return "배송완료";
      default:
        return status;
    }
  };

  const handleApproveOrder = (orderId: string) => {
    // 주문 승인 로직
    alert(`주문 ${orderId}이(가) 승인되었습니다.`);
  };

  const handleRejectOrder = (orderId: string) => {
    // 주문 거부 로직
    alert(`주문 ${orderId}이(가) 거부되었습니다.`);
  };

  const getBOMForPart = (partId: string) => {
    return billOfMaterials.find((bom) => bom.partId === partId);
  };

  const checkMaterialAvailability = (
    materialId: string,
    requiredQuantity: number,
  ) => {
    const material = rawMaterials.find((m) => m.id === materialId);
    return material ? material.currentStock >= requiredQuantity : false;
  };

  const columns = [
    { key: "id", title: "주문 ID" },
    { key: "warehouseName", title: "창고명" },
    { key: "orderDate", title: "주문일" },
    {
      key: "status",
      title: "상태",
      render: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(value)}`}
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
    <PageLayout
      sidebarItems={factorySidebarItems}
      userRole="Factory Manager"
      pageTitle="주문 관리"
      pageDescription="창고에서 들어온 주문을 관리하세요"
    >
      {/* Tabs */}
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

      {/* Orders Table */}
      <div className="rounded-xl border border-grey-100 bg-bg-card-white shadow-sm transition-colors duration-200 dark:border-grey-700 dark:bg-bg-card-black">
        <div className="border-b border-grey-100 p-6 dark:border-grey-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-grey-500 dark:text-grey-100">
              주문 목록
            </h3>
            <div className="text-sm text-grey-500 dark:text-grey-300">
              총 {factoryOrders.length}개 주문
            </div>
          </div>
        </div>
        <Table data={factoryOrders} columns={columns} />
      </div>

      {/* Order Details Modal */}
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
                    창고명
                  </p>
                  <p className="font-medium text-grey-500 dark:text-grey-100">
                    {selectedOrder.warehouseName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-grey-500 dark:text-grey-300">
                    주문일
                  </p>
                  <p className="font-medium text-grey-500 dark:text-grey-100">
                    {selectedOrder.orderDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-grey-500 dark:text-grey-300">
                    상태
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
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
                {selectedOrder.parts.map((part: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-bg-white p-4 transition-colors duration-200 dark:bg-bg-black"
                  >
                    <div>
                      <p className="font-medium text-grey-500 dark:text-grey-100">
                        {part.partName}
                      </p>
                      <p className="text-sm text-grey-500 dark:text-grey-300">
                        부품 ID: {part.partId}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-grey-500 dark:text-grey-100">
                        {part.quantity}개
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowBOM(getBOMForPart(part.partId))}
                      >
                        BOM 보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.status === "Pending" && (
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

      {/* BOM Modal */}
      {showBOM && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-lg rounded-xl bg-bg-card-white p-6 transition-colors duration-200 dark:bg-bg-card-black">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-grey-500 dark:text-grey-100">
                BOM - {showBOM.partName}
              </h2>
              <button
                onClick={() => setShowBOM(null)}
                className="text-grey-400 hover:text-grey-500 dark:text-grey-300 dark:hover:text-grey-200"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-3">
              {showBOM.materials.map((material: any, index: number) => {
                const isAvailable = checkMaterialAvailability(
                  material.materialId,
                  material.requiredQuantity,
                );
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-bg-white p-3 transition-colors duration-200 dark:bg-bg-black"
                  >
                    <div>
                      <p className="font-medium text-grey-500 dark:text-grey-100">
                        {material.materialName}
                      </p>
                      <p className="text-sm text-grey-500 dark:text-grey-300">
                        필요량: {material.requiredQuantity} {material.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-error-red/10 text-error-red"
                        }`}
                      >
                        {isAvailable ? "재고 충분" : "재고 부족"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export { FactoryOrders };
