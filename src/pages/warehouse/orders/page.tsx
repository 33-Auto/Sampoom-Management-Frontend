import { useState } from "react";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Input, Select } from "@/shared/ui";

export default function WarehouseOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { showSuccess, showInfo, showConfirm } = useNotification();

  const orders = [
    {
      id: "WH-2024-0115-001",
      dealer: "서울 강남 대리점",
      contact: "김대리 (02-1234-5678)",
      items: 15,
      totalValue: 2850000,
      priority: "urgent",
      status: "pickup_ready",
      orderTime: "09:15",
      estimatedPickup: "16:00",
      address: "서울시 강남구 테헤란로 123",
      orderDate: "2024-01-15",
      parts: [
        { code: "ENG-4521", name: "엔진 오일 필터", quantity: 5, price: 85000 },
        {
          code: "BRK-3301",
          name: "브레이크 디스크",
          quantity: 8,
          price: 120000,
        },
        { code: "TIR-7789", name: "타이어 밸브 캡", quantity: 2, price: 15000 },
      ],
    },
    {
      id: "WH-2024-0115-002",
      dealer: "부산 해운대 대리점",
      contact: "이과장 (051-9876-5432)",
      items: 8,
      totalValue: 1650000,
      priority: "normal",
      status: "packaging",
      orderTime: "10:30",
      estimatedPickup: "17:30",
      address: "부산시 해운대구 해운대로 456",
      orderDate: "2024-01-15",
      parts: [
        {
          code: "ELC-9902",
          name: "헤드라이트 벌브",
          quantity: 4,
          price: 45000,
        },
        { code: "AIR-5566", name: "에어 필터", quantity: 4, price: 32000 },
      ],
    },
    {
      id: "WH-2024-0115-003",
      dealer: "대구 수성 대리점",
      contact: "박팀장 (053-2468-1357)",
      items: 22,
      totalValue: 4200000,
      priority: "high",
      status: "processing",
      orderTime: "11:45",
      estimatedPickup: "18:00",
      address: "대구시 수성구 동대구로 789",
      orderDate: "2024-01-15",
      parts: [
        { code: "TRN-8844", name: "변속기 오일", quantity: 10, price: 95000 },
        {
          code: "SUS-2233",
          name: "서스펜션 스프링",
          quantity: 8,
          price: 180000,
        },
        { code: "EXH-7711", name: "배기관 가스켓", quantity: 4, price: 25000 },
      ],
    },
    {
      id: "WH-2024-0115-004",
      dealer: "인천 연수 대리점",
      contact: "최부장 (032-5555-7777)",
      items: 12,
      totalValue: 2100000,
      priority: "normal",
      status: "pending",
      orderTime: "13:20",
      estimatedPickup: "19:00",
      address: "인천시 연수구 컨벤시아대로 321",
      orderDate: "2024-01-15",
      parts: [
        { code: "CLU-9988", name: "클러치 디스크", quantity: 6, price: 150000 },
        {
          code: "RAD-4455",
          name: "라디에이터 호스",
          quantity: 6,
          price: 35000,
        },
      ],
    },
    {
      id: "WH-2024-0115-005",
      dealer: "광주 서구 대리점",
      contact: "정차장 (062-3333-9999)",
      items: 6,
      totalValue: 980000,
      priority: "low",
      status: "shipping",
      orderTime: "14:10",
      estimatedPickup: "완료",
      address: "광주시 서구 상무대로 654",
      orderDate: "2024-01-15",
      parts: [
        {
          code: "WIN-6677",
          name: "와이퍼 블레이드",
          quantity: 4,
          price: 28000,
        },
        { code: "BAT-1122", name: "배터리", quantity: 2, price: 350000 },
      ],
    },
  ];

  const statusOptions = [
    { value: "all", label: "전체 상태" },
    { value: "pending", label: "승인 대기" },
    { value: "processing", label: "처리중" },
    { value: "packaging", label: "포장중" },
    { value: "pickup_ready", label: "픽업 대기" },
    { value: "shipping", label: "배송중" },
    { value: "completed", label: "완료" },
  ];

  const priorityOptions = [
    { value: "all", label: "전체 우선순위" },
    { value: "urgent", label: "긴급" },
    { value: "high", label: "높음" },
    { value: "normal", label: "보통" },
    { value: "low", label: "낮음" },
  ];

  // 버튼 핸들러 함수들
  // const handlePrintDeliveryNote = () => {
  //   showInfo('출고 전표 출력', '선택된 주문의 출고 전표를 출력합니다.');
  //   // 실제로는 프린터 API 호출
  // };

  // const handleManualOrder = () => {
  //   setShowManualOrderModal(true);
  // };

  const handleQRScan = () => {
    showInfo("QR 스캔", "QR 코드 스캐너를 실행합니다.");
    // 실제로는 카메라 API 호출
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetailModal(true);
  };

  const handlePrintOrder = (order: any) => {
    showSuccess("주문서 출력", `${order.id} 주문서를 출력합니다.`);
  };

  const handleProcessOrder = (order: any) => {
    showConfirm({
      title: "주문 처리",
      message: `${order.id} 주문을 처리하시겠습니까?`,
      confirmText: "처리",
      onConfirm: () => {
        showSuccess("주문 처리 완료", `${order.id} 주문이 처리되었습니다.`);
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipping":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pickup_ready":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "packaging":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료";
      case "shipping":
        return "배송중";
      case "pickup_ready":
        return "픽업 대기";
      case "packaging":
        return "포장중";
      case "processing":
        return "처리중";
      case "pending":
        return "승인 대기";
      default:
        return "알 수 없음";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "긴급";
      case "high":
        return "높음";
      case "normal":
        return "보통";
      case "low":
        return "낮음";
      default:
        return "알 수 없음";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.dealer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || order.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const processingOrders = orders.filter(
    (o) => o.status === "processing" || o.status === "packaging",
  ).length;
  const totalValue = orders.reduce((sum, o) => sum + o.totalValue, 0);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                오늘 총 주문
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalOrders}
              </p>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                접수된 주문
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <i className="ri-file-list-3-line text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                승인 대기
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingOrders}
              </p>
              <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                처리 필요
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <i className="ri-time-line text-orange-600 dark:text-orange-400"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                처리중인 주문
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {processingOrders}
              </p>
              <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                작업 진행중
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <i className="ri-settings-3-line text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                총 주문 금액
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₩{(totalValue / 1000000).toFixed(1)}M
              </p>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                오늘 매출
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <i className="ri-money-dollar-circle-line text-green-600 dark:text-green-400"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input
            placeholder="주문번호, 대리점명, 담당자 검색..."
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
          <Button variant="secondary" size="default" onClick={handleQRScan}>
            <i className="ri-qr-code-line mr-2"></i>
            QR 스캔
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 p-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            주문 목록
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {order.id}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getPriorityColor(order.priority)}`}
                      >
                        {getPriorityText(order.priority)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          대리점
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.dealer}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          담당자
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.contact}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          주문 시간
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.orderTime}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <i className="ri-eye-line"></i>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePrintOrder(order)}
                    >
                      <i className="ri-printer-line"></i>
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleProcessOrder(order)}
                    >
                      <i className="ri-check-line"></i>
                    </Button>
                  </div>
                </div>

                <div className="mb-3 grid grid-cols-1 gap-4 text-sm md:grid-cols-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">품목 수</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.items}개
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">총 금액</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₩{order.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      예상 픽업
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.estimatedPickup}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">배송지</p>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {order.address}
                    </p>
                  </div>
                </div>

                {/* Parts List */}
                <div className="mt-3 rounded border bg-white p-3 dark:bg-gray-800">
                  <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    주문 부품 목록
                  </h4>
                  <div className="space-y-1">
                    {order.parts.map((part, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            {part.code}
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {part.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {part.quantity}개
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ₩{part.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Order Modal */}
      {showManualOrderModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                수동 주문 등록
              </h3>
              <button
                onClick={() => setShowManualOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="대리점명" />
                <Input placeholder="담당자명" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="연락처" />
                <Select options={priorityOptions.slice(1)} value="normal" />
              </div>
              <Input placeholder="배송 주소" />
              <div className="border-t pt-4">
                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                  주문 부품
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    <Input placeholder="부품 코드" />
                    <Input placeholder="부품명" />
                    <Input placeholder="수량" type="number" />
                    <Button variant="secondary" size="sm">
                      <i className="ri-add-line"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowManualOrderModal(false)}
              >
                취소
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  showSuccess("주문 등록 완료", "수동 주문이 등록되었습니다.");
                  setShowManualOrderModal(false);
                }}
              >
                주문 등록
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetailModal && selectedOrder && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                주문 상세 정보
              </h3>
              <button
                onClick={() => setShowOrderDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-6">
              <div>
                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                  주문 정보
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      주문번호:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      주문일시:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.orderDate} {selectedOrder.orderTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      상태:
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      우선순위:
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs font-medium ${getPriorityColor(selectedOrder.priority)}`}
                    >
                      {getPriorityText(selectedOrder.priority)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                  대리점 정보
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      대리점명:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.dealer}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      담당자:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.contact}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      배송지:
                    </span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {selectedOrder.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      예상 픽업:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedOrder.estimatedPickup}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                주문 부품 상세
              </h4>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div className="space-y-3">
                  {selectedOrder.parts.map((part: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded border bg-white p-3 dark:bg-gray-800"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                            {part.code}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {part.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          수량: {part.quantity}개
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₩{part.price.toLocaleString()}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ₩{(part.quantity * part.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      총 주문 금액:
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₩{selectedOrder.totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => handlePrintOrder(selectedOrder)}
              >
                <i className="ri-printer-line mr-2"></i>
                출력
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleProcessOrder(selectedOrder);
                  setShowOrderDetailModal(false);
                }}
              >
                <i className="ri-check-line mr-2"></i>
                처리
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
