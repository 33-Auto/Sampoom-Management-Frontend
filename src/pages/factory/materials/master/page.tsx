import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Select } from "@/shared/ui";
import { useNotification } from "@/app/providers/NotificationContext";

export default function MaterialMaster() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { showError, showSuccess, showInfo } = useNotification();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 품목 마스터 데이터
  const itemMasterData = [
    {
      code: "RAW-AL-001",
      name: "알루미늄 합금 봉재",
      category: "원자재",
      subCategory: "금속 > 비철금속",
      type: "raw_material",
      unit: "kg",
      procurementType: "purchase",
      defaultSupplier: "대한금속",
      standardCost: 15000,
      leadTime: 7,
      minStock: 100,
      maxStock: 500,
      currentStock: 245,
      status: "active",
    },
    {
      code: "RAW-RU-002",
      name: "고무 시일링",
      category: "원자재",
      subCategory: "화학 > 고무제품",
      type: "raw_material",
      unit: "개",
      procurementType: "purchase",
      defaultSupplier: "한국고무",
      standardCost: 2500,
      leadTime: 5,
      minStock: 200,
      maxStock: 1000,
      currentStock: 456,
      status: "active",
    },
    {
      code: "ELE-SEN-003",
      name: "전자 센서",
      category: "부품",
      subCategory: "전자부품 > 센서",
      type: "component",
      unit: "개",
      procurementType: "purchase",
      defaultSupplier: "삼성전자",
      standardCost: 45000,
      leadTime: 14,
      minStock: 50,
      maxStock: 200,
      currentStock: 89,
      status: "active",
    },
    {
      code: "HW-BOL-004",
      name: "M5 육각 볼트",
      category: "부품",
      subCategory: "하드웨어 > 볼트류",
      type: "component",
      unit: "개",
      procurementType: "purchase",
      defaultSupplier: "정밀나사",
      standardCost: 150,
      leadTime: 3,
      minStock: 1000,
      maxStock: 5000,
      currentStock: 2340,
      status: "active",
    },
    {
      code: "PLA-HOU-005",
      name: "플라스틱 하우징",
      category: "부품",
      subCategory: "플라스틱 > 사출품",
      type: "component",
      unit: "개",
      procurementType: "purchase",
      defaultSupplier: "대성플라스틱",
      standardCost: 8500,
      leadTime: 10,
      minStock: 100,
      maxStock: 300,
      currentStock: 156,
      status: "active",
    },
    {
      code: "RAW-CU-006",
      name: "구리 와이어",
      category: "원자재",
      subCategory: "금속 > 전선",
      type: "raw_material",
      unit: "m",
      procurementType: "purchase",
      defaultSupplier: "LS전선",
      standardCost: 1200,
      leadTime: 7,
      minStock: 500,
      maxStock: 2000,
      currentStock: 1245,
      status: "active",
    },
    {
      code: "FLU-HYD-007",
      name: "유압유",
      category: "원자재",
      subCategory: "화학 > 오일류",
      type: "raw_material",
      unit: "L",
      procurementType: "purchase",
      defaultSupplier: "SK에너지",
      standardCost: 8000,
      leadTime: 5,
      minStock: 200,
      maxStock: 1000,
      currentStock: 567,
      status: "active",
    },
    {
      code: "MEC-BEA-008",
      name: "베어링",
      category: "부품",
      subCategory: "기계부품 > 베어링",
      type: "component",
      unit: "개",
      procurementType: "purchase",
      defaultSupplier: "NSK코리아",
      standardCost: 25000,
      leadTime: 14,
      minStock: 50,
      maxStock: 200,
      currentStock: 78,
      status: "active",
    },
    {
      code: "FIN-ENG-001",
      name: "엔진 어셈블리 A-Type",
      category: "완제품",
      subCategory: "엔진 > 어셈블리",
      type: "finished_good",
      unit: "개",
      procurementType: "production",
      defaultSupplier: "-",
      standardCost: 850000,
      leadTime: 21,
      minStock: 10,
      maxStock: 50,
      currentStock: 23,
      status: "active",
    },
    {
      code: "FIN-BRA-002",
      name: "브레이크 시스템 B-Type",
      category: "완제품",
      subCategory: "브레이크 > 시스템",
      type: "finished_good",
      unit: "개",
      procurementType: "production",
      defaultSupplier: "-",
      standardCost: 450000,
      leadTime: 14,
      minStock: 15,
      maxStock: 60,
      currentStock: 34,
      status: "active",
    },
  ];

  const categoryOptions = [
    { value: "all", label: "전체 카테고리" },
    { value: "원자재", label: "원자재" },
    { value: "부품", label: "부품" },
    { value: "완제품", label: "완제품" },
  ];

  const typeOptions = [
    { value: "all", label: "전체 유형" },
    { value: "raw_material", label: "원자재" },
    { value: "component", label: "부품" },
    { value: "finished_good", label: "완제품" },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "raw_material":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "component":
        return "bg-green-100 text-green-700 border-green-200";
      case "finished_good":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "raw_material":
        return "원자재";
      case "component":
        return "부품";
      case "finished_good":
        return "완제품";
      default:
        return "알 수 없음";
    }
  };

  const getProcurementColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "text-orange-600";
      case "production":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  const getProcurementText = (type: string) => {
    switch (type) {
      case "purchase":
        return "구매";
      case "production":
        return "생산";
      default:
        return "알 수 없음";
    }
  };

  const getStockStatus = (current: number, min: number, max: number) => {
    if (current <= min) return { color: "text-red-600", text: "부족" };
    if (current >= max) return { color: "text-orange-600", text: "과다" };
    return { color: "text-green-600", text: "적정" };
  };

  const handleSelectItem = (itemCode: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemCode)
        ? prev.filter((code) => code !== itemCode)
        : [...prev, itemCode],
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.code));
    }
  };

  const handleViewDetail = (item: any) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleCreateItem = () => {
    setShowCreateModal(true);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      showError("오류", "삭제할 품목을 선택해주세요.");
      return;
    }
    showSuccess("성공", `${selectedItems.length}개의 품목이 삭제되었습니다.`);
    setSelectedItems([]);
  };

  const filteredItems = itemMasterData.filter((item) => {
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  // 통계 계산
  const totalItems = itemMasterData.length;
  const rawMaterials = itemMasterData.filter(
    (i) => i.type === "raw_material",
  ).length;
  const components = itemMasterData.filter(
    (i) => i.type === "component",
  ).length;
  const finishedGoods = itemMasterData.filter(
    (i) => i.type === "finished_good",
  ).length;
  const lowStockItems = itemMasterData.filter(
    (i) => i.currentStock <= i.minStock,
  ).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <Select
        options={categoryOptions}
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      />
      <Select
        options={typeOptions}
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      />
      <Button
        variant="secondary"
        size="default"
        onClick={handleDeleteSelected}
        disabled={selectedItems.length === 0}
      >
        <i className="ri-delete-bin-line mr-2"></i>
        선택 삭제
      </Button>

      {/* Items List */}
      <div
        className="rounded-lg border bg-white shadow-sm"
        style={{ borderColor: "#CCCCCC" }}
      >
        <div className="border-b p-4" style={{ borderColor: "#CCCCCC" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: "#17191B" }}>
              품목 목록
            </h2>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={
                  selectedItems.length === filteredItems.length &&
                  filteredItems.length > 0
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 focus:ring-2"
                style={{ accentColor: "#8080FF" }}
              />
              <span className="text-sm" style={{ color: "#7C7C7C" }}>
                전체 선택
              </span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(
                item.currentStock,
                item.minStock,
                item.maxStock,
              );
              return (
                <div
                  key={item.code}
                  className="rounded-lg border p-4"
                  style={{ backgroundColor: "#F5F5F5", borderColor: "#CCCCCC" }}
                >
                  <div className="items-start justify-between">
                    <div className="items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.code)}
                        onChange={() => handleSelectItem(item.code)}
                        className="mt-1 rounded border-gray-300 focus:ring-2"
                        style={{ accentColor: "#8080FF" }}
                      />
                      <div className="-1">
                        <div className="mb-2 flex items-center space-x-3">
                          <span
                            className="font-semibold"
                            style={{ color: "#17191B" }}
                          >
                            {item.code}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-1 text-xs font-medium ${getTypeColor(item.type)}`}
                          >
                            {getTypeText(item.type)}
                          </span>
                          <span
                            className={`text-xs font-medium ${getProcurementColor(item.procurementType)}`}
                          >
                            {getProcurementText(item.procurementType)}
                          </span>
                        </div>
                        <h3
                          className="mb-2 font-medium"
                          style={{ color: "#17191B" }}
                        >
                          {item.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-5">
                          <div>
                            <p style={{ color: "#7C7C7C" }}>카테고리</p>
                            <p
                              className="font-medium"
                              style={{ color: "#17191B" }}
                            >
                              {item.subCategory}
                            </p>
                          </div>
                          <div>
                            <p style={{ color: "#7C7C7C" }}>단위</p>
                            <p
                              className="font-medium"
                              style={{ color: "#17191B" }}
                            >
                              {item.unit}
                            </p>
                          </div>
                          <div>
                            <p style={{ color: "#7C7C7C" }}>현재 재고</p>
                            <p className={`font-medium ${stockStatus.color}`}>
                              {item.currentStock.toLocaleString()} {item.unit}
                            </p>
                          </div>
                          <div>
                            <p style={{ color: "#7C7C7C" }}>표준 단가</p>
                            <p
                              className="font-medium"
                              style={{ color: "#17191B" }}
                            >
                              ₩{item.standardCost.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p style={{ color: "#7C7C7C" }}>리드타임</p>
                            <p
                              className="font-medium"
                              style={{ color: "#17191B" }}
                            >
                              {item.leadTime}일
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewDetail(item)}
                      >
                        <i className="ri-eye-line"></i>
                      </Button>
                      <Button variant="secondary" size="sm">
                        <i className="ri-edit-line"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedItem && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">품목 상세 정보</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">품목 코드</p>
                    <p className="font-medium">{selectedItem.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">품목명</p>
                    <p className="font-medium">{selectedItem.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">카테고리</p>
                    <p className="font-medium">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">세부 카테고리</p>
                    <p className="font-medium">{selectedItem.subCategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">유형</p>
                    <p className="font-medium">
                      {getTypeText(selectedItem.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">단위</p>
                    <p className="font-medium">{selectedItem.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">조달 방식</p>
                    <p className="font-medium">
                      {getProcurementText(selectedItem.procurementType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">기본 공급업체</p>
                    <p className="font-medium">
                      {selectedItem.defaultSupplier}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">표준 단가</p>
                    <p className="font-medium">
                      ₩{selectedItem.standardCost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">리드타임</p>
                    <p className="font-medium">{selectedItem.leadTime}일</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">최소 재고</p>
                    <p className="font-medium">
                      {selectedItem.minStock} {selectedItem.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">최대 재고</p>
                    <p className="font-medium">
                      {selectedItem.maxStock} {selectedItem.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">현재 재고</p>
                    <p className="font-medium">
                      {selectedItem.currentStock} {selectedItem.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">재고 상태</p>
                    <p className="font-medium">
                      {
                        getStockStatus(
                          selectedItem.currentStock,
                          selectedItem.minStock,
                          selectedItem.maxStock,
                        ).text
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 justify-end space-x-3">
                <Button variant="secondary">수정</Button>
                <Button variant="default">저장</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
