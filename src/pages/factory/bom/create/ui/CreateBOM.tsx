import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Input, Select } from "@/shared/ui";

export const CreateBOM = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

  const [formData, setFormData] = useState({
    productName: "",
    version: "1.0",
    status: "draft",
    description: "",
  });

  const [materials, setMaterials] = useState<any[]>([]);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<
    number | null
  >(null);

  // 품목 마스터 데이터 (MaterialMaster 페이지와 동일한 데이터 사용)
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
  ];

  const statusOptions = [
    { value: "draft", label: "초안" },
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" },
  ];

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        itemCode: "",
        itemName: "",
        quantity: "",
        unit: "",
        standardCost: 0,
        totalCost: 0,
      },
    ]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };

    // 수량이 변경되면 총 비용 재계산
    if (field === "quantity") {
      const quantity = parseFloat(value) || 0;
      const standardCost = updatedMaterials[index].standardCost || 0;
      updatedMaterials[index].totalCost = quantity * standardCost;
    }

    setMaterials(updatedMaterials);
  };

  const selectItemFromMaster = (item: any) => {
    if (selectedMaterialIndex !== null) {
      const updatedMaterials = [...materials];
      updatedMaterials[selectedMaterialIndex] = {
        ...updatedMaterials[selectedMaterialIndex],
        itemCode: item.code,
        itemName: item.name,
        unit: item.unit,
        standardCost: item.standardCost,
        totalCost:
          (parseFloat(updatedMaterials[selectedMaterialIndex].quantity) || 0) *
          item.standardCost,
      };
      setMaterials(updatedMaterials);
      setShowItemSelector(false);
      setSelectedMaterialIndex(null);
    }
  };

  const openItemSelector = (index: number) => {
    setSelectedMaterialIndex(index);
    setShowItemSelector(true);
  };

  const handleSave = () => {
    if (!formData.productName.trim()) {
      showError("오류", "제품명을 입력해주세요.");
      return;
    }

    if (materials.length === 0) {
      showError("오류", "최소 1개 이상의 원자재를 추가해주세요.");
      return;
    }

    const incompleteMaterials = materials.filter(
      (m) => !m.itemCode || !m.quantity,
    );
    if (incompleteMaterials.length > 0) {
      showError("오류", "모든 원자재의 정보를 완성해주세요.");
      return;
    }

    // BOM ID 자동 생성
    const bomId = `BOM-${Date.now().toString().slice(-6)}`;

    showSuccess("성공", `BOM ${bomId}가 성공적으로 생성되었습니다.`);
    navigate("/factory/bom");
  };

  const totalMaterialCost = materials.reduce(
    (sum, material) => sum + (material.totalCost || 0),
    0,
  );
  const completedMaterials = materials.filter(
    (m) => m.itemCode && m.quantity,
  ).length;

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

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5F5" }}>
      <div className="-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => navigate("/factory/bom")}
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  BOM 목록
                </Button>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "#17191B" }}>
                새 BOM 생성
              </h1>
              <p style={{ color: "#7C7C7C" }}>
                새로운 자재 명세서를 생성합니다
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => navigate("/factory/bom")}
              >
                취소
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <i className="ri-save-line mr-2"></i>
                저장
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1">
            <div
              className="rounded-lg border bg-white p-6 shadow-sm"
              style={{ borderColor: "#CCCCCC" }}
            >
              <h2
                className="mb-4 text-lg font-semibold"
                style={{ color: "#17191B" }}
              >
                기본 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    제품명 *
                  </label>
                  <Input
                    placeholder="제품명을 입력하세요"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    버전
                  </label>
                  <Input
                    placeholder="1.0"
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    상태
                  </label>
                  <Select
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-medium"
                    style={{ color: "#17191B" }}
                  >
                    설명
                  </label>
                  <textarea
                    className="w-full resize-none rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    style={{
                      borderColor: "#CCCCCC",
                    }}
                    rows={3}
                    placeholder="BOM 설명을 입력하세요"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div
              className="mt-6 rounded-lg border bg-white p-6 shadow-sm"
              style={{ borderColor: "#CCCCCC" }}
            >
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: "#17191B" }}
              >
                요약
              </h3>
              <div className="space-y-3">
                <div className="justify-between">
                  <span style={{ color: "#7C7C7C" }}>총 원자재 수:</span>
                  <span className="font-medium" style={{ color: "#17191B" }}>
                    {materials.length}개
                  </span>
                </div>
                <div className="justify-between">
                  <span style={{ color: "#7C7C7C" }}>완료된 항목:</span>
                  <span className="font-medium" style={{ color: "#17191B" }}>
                    {completedMaterials}개
                  </span>
                </div>
                <div className="justify-between">
                  <span style={{ color: "#7C7C7C" }}>총 원자재 비용:</span>
                  <span className="font-medium" style={{ color: "#17191B" }}>
                    ₩{totalMaterialCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Materials */}
          <div className="lg:col-span-2">
            <div
              className="rounded-lg border bg-white shadow-sm"
              style={{ borderColor: "#CCCCCC" }}
            >
              <div className="border-b p-6" style={{ borderColor: "#CCCCCC" }}>
                <div className="flex items-center justify-between">
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: "#17191B" }}
                  >
                    원자재 구성
                  </h2>
                  <Button variant="default" size="sm" onClick={addMaterial}>
                    <i className="ri-add-line mr-2"></i>
                    원자재 추가
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {materials.length === 0 ? (
                  <div className="py-12 text-center">
                    <i
                      className="ri-inbox-line mb-4 text-4xl"
                      style={{ color: "#CCCCCC" }}
                    ></i>
                    <p style={{ color: "#7C7C7C" }}>원자재를 추가해주세요</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {materials.map((material, index) => (
                      <div
                        key={material.id}
                        className="rounded-lg border p-4"
                        style={{
                          backgroundColor: "#F5F5F5",
                          borderColor: "#CCCCCC",
                        }}
                      >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                          <div className="md:col-span-2">
                            <label
                              className="mb-2 block text-sm font-medium"
                              style={{ color: "#17191B" }}
                            >
                              품목 선택 *
                            </label>
                            <div className="space-x-2">
                              <Input
                                placeholder="품목 코드"
                                value={material.itemCode}
                                readOnly
                                className="-1"
                              />
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openItemSelector(index)}
                              >
                                <i className="ri-search-line"></i>
                              </Button>
                            </div>
                            {material.itemName && (
                              <p
                                className="mt-1 text-sm"
                                style={{ color: "#7C7C7C" }}
                              >
                                {material.itemName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              className="mb-2 block text-sm font-medium"
                              style={{ color: "#17191B" }}
                            >
                              수량 *
                            </label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={material.quantity}
                              onChange={(e) =>
                                updateMaterial(
                                  index,
                                  "quantity",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div>
                            <label
                              className="mb-2 block text-sm font-medium"
                              style={{ color: "#17191B" }}
                            >
                              단위
                            </label>
                            <Input
                              placeholder="단위"
                              value={material.unit}
                              readOnly
                            />
                          </div>

                          <div>
                            <label
                              className="mb-2 block text-sm font-medium"
                              style={{ color: "#17191B" }}
                            >
                              단가
                            </label>
                            <Input
                              placeholder="₩0"
                              value={
                                material.standardCost
                                  ? `₩${material.standardCost.toLocaleString()}`
                                  : ""
                              }
                              readOnly
                            />
                          </div>

                          <div className="items-end">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => removeMaterial(index)}
                              className="w-full"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </Button>
                          </div>
                        </div>

                        {material.totalCost > 0 && (
                          <div
                            className="mt-3 border-t pt-3"
                            style={{ borderColor: "#CCCCCC" }}
                          >
                            <div className="justify-between">
                              <span style={{ color: "#7C7C7C" }}>총 비용:</span>
                              <span
                                className="font-medium"
                                style={{ color: "#17191B" }}
                              >
                                ₩{material.totalCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Item Selector Modal */}
      {showItemSelector && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold" style={{ color: "#17191B" }}>
                품목 선택 - 품목 마스터
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowItemSelector(false)}
              >
                <i className="ri-close-line"></i>
              </Button>
            </div>

            <div className="space-y-4">
              {itemMasterData
                .filter((item) => item.status === "active")
                .map((item) => (
                  <div
                    key={item.code}
                    className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50"
                    style={{ borderColor: "#CCCCCC" }}
                    onClick={() => selectItemFromMaster(item)}
                  >
                    <div className="flex items-center justify-between">
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
                        <h4
                          className="mb-1 font-medium"
                          style={{ color: "#17191B" }}
                        >
                          {item.name}
                        </h4>
                        <p className="text-sm" style={{ color: "#7C7C7C" }}>
                          {item.subCategory}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" style={{ color: "#17191B" }}>
                          ₩{item.standardCost.toLocaleString()}
                        </p>
                        <p className="text-sm" style={{ color: "#7C7C7C" }}>
                          단위: {item.unit}
                        </p>
                        <p className="text-sm" style={{ color: "#7C7C7C" }}>
                          재고: {item.currentStock.toLocaleString()}
                        </p>
                        <p className="text-sm" style={{ color: "#7C7C7C" }}>
                          공급업체: {item.defaultSupplier}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
