import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { materialMasterData } from "@/mocks/factoryData";
import { Button, Input, Select } from "@/shared/ui";

interface BOMItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  itemType: string;
  category: string;
}

export const CreateBOM = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [bomName, setBomName] = useState("");
  const [category, setCategory] = useState("");
  const [version, setVersion] = useState("1.0");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("검토중");
  const [bomItems, setBomItems] = useState<BOMItem[]>([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const rawMaterialCategories = [
    { value: "", label: "카테고리 선택" },
    {
      value: "부품 > 안전 > 제동 > 브레이크",
      label: "부품 > 안전 > 제동 > 브레이크",
    },
    {
      value: "부품 > 섀시 > 현가장치 > 서스펜션",
      label: "부품 > 섀시 > 현가장치 > 서스펜션",
    },
    {
      value: "부품 > 기계 > 동력전달 > 기어박스",
      label: "부품 > 기계 > 동력전달 > 기어박스",
    },
    {
      value: "부품 > 전기 > 조명 > LED모듈",
      label: "부품 > 전기 > 조명 > LED모듈",
    },
    { value: "부품 > 내장 > 시트 > 쿠션", label: "부품 > 내장 > 시트 > 쿠션" },
    {
      value: "부품 > 플라스틱 > 외장재 > 하우징",
      label: "부품 > 플라스틱 > 외장재 > 하우징",
    },
    {
      value: "부품 > 기계 > 동력전달 > 어셈블리",
      label: "부품 > 기계 > 동력전달 > 어셈블리",
    },
    { value: "부품 > 전자 > 제어 > 모듈", label: "부품 > 전자 > 제어 > 모듈" },
  ];

  const statusOptions = [
    { value: "검토중", label: "검토중" },
    { value: "승인대기", label: "승인대기" },
    { value: "활성", label: "활성" },
    { value: "비활성", label: "비활성" },
  ];

  const handleAddItem = (item: any) => {
    try {
      const existingItem = bomItems.find(
        (bomItem) => bomItem.itemCode === item.itemCode,
      );
      if (existingItem) {
        showError("중복 오류", "이미 추가된 품목입니다.");
        return;
      }

      const newItem: BOMItem = {
        id: Date.now().toString(),
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: 1,
        unit: item.unit,
        unitCost: item.standardPrice,
        totalCost: item.standardPrice,
        itemType: item.itemType,
        category: item.category,
      };
      setBomItems((prev) => [...prev, newItem]);
      setShowItemModal(false);
    } catch (err) {
      console.error(err);
      showError("추가 오류", "부품을 추가하는 중 문제가 발생했습니다.");
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setBomItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity, totalCost: quantity * item.unitCost }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setBomItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCost = bomItems.reduce((sum, item) => sum + item.totalCost, 0);
  const totalQuantity = bomItems.reduce((sum, item) => sum + item.quantity, 0);

  const getComplexityLevel = () => {
    const itemCount = bomItems.length;
    if (itemCount <= 5) return { level: "단순", color: "text-green-600" };
    if (itemCount <= 15) return { level: "보통", color: "text-yellow-600" };
    return { level: "복잡", color: "text-red-600" };
  };

  const validateForm = () => {
    if (!bomName.trim()) {
      showError("입력 오류", "BOM 명을 입력해주세요.");
      return false;
    }
    if (!category) {
      showError("입력 오류", "카테고리를 선택해주세요.");
      return false;
    }
    if (bomItems.length === 0) {
      showError("입력 오류", "최소 1개 이상의 구성품이 필요합니다.");
      return false;
    }
    return true;
  };

  const generateBomCode = () => {
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `BOM-${randomNum}`;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const finalBomCode = generateBomCode();

      const bomData = {
        bomCode: finalBomCode,
        bomName,
        itemType: "부품",
        category,
        version,
        description,
        status,
        items: bomItems,
        totalCost,
        complexity: getComplexityLevel().level,
        createdAt: new Date().toISOString(),
      };

      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("BOM 저장:", bomData);
      showSuccess(
        "등록 완료",
        `BOM이 성공적으로 등록되었습니다. (코드: ${finalBomCode})`,
      );
      navigate("/master/bom");
    } catch (error) {
      console.error(error);
      showError("등록 실패", "BOM 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/master/bom");
  };

  const filteredItems = materialMasterData.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const isRawMaterial = item.itemType === "원자재";
    const isActive = item.status === "활성";
    return matchesSearch && isRawMaterial && isActive;
  });

  const complexity = getComplexityLevel();

  return (
    <>
      <div className="p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="mb-2 flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <i className="ri-arrow-left-line text-gray-600 dark:text-gray-400"></i>
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                BOM 신규 등록
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              새로운 자재 명세서를 생성합니다. BOM 코드는 자동으로 생성됩니다.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="BOM 명"
                    value={bomName}
                    onChange={(e) => setBomName(e.target.value)}
                    placeholder="엔진 어셈블리 A-Type"
                  />
                  <Select
                    label="카테고리"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={rawMaterialCategories}
                  />
                  <Input
                    label="버전"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.0"
                  />
                  <Select
                    label="상태"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={statusOptions}
                  />
                </div>
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    구성품 목록 (원자재)
                    {bomItems.length > 0 && (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
                        {bomItems.length}개
                      </span>
                    )}
                  </h3>
                  <Button
                    onClick={() => setShowItemModal(true)}
                    className="flex items-center gap-2"
                  >
                    <i className="ri-add-line"></i>
                    원자재 추가
                  </Button>
                </div>

                {bomItems.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <i className="ri-inbox-line mb-4 text-4xl text-gray-400"></i>
                    <p className="mb-2 text-lg text-gray-600">
                      등록된 원자재가 없습니다
                    </p>
                    <p className="text-sm text-gray-500">
                      원자재 추가 버튼을 클릭하여 구성품을 추가하세요
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              품목 코드
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              품목명
                            </th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700">
                              수량
                            </th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700">
                              단위
                            </th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">
                              단가
                            </th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">
                              총액
                            </th>
                            <th className="px-4 py-3 text-center font-medium text-gray-700">
                              작업
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {bomItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                                  {item.itemCode}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {item.itemName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.category}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.id,
                                      Number(e.target.value),
                                    )
                                  }
                                  className="w-20 rounded border px-2 py-1 text-center focus:ring-2 focus:ring-main-500 focus:outline-none"
                                  min="1"
                                />
                              </td>
                              <td className="px-4 py-3 text-center text-gray-600">
                                {item.unit}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900">
                                ₩{item.unitCost.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                ₩{item.totalCost.toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="rounded p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                                  title="삭제"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {bomItems.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-6">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900">
                    요약 정보
                  </h4>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {bomItems.length}
                      </div>
                      <div className="text-sm text-gray-600">원자재 수</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {totalQuantity}
                      </div>
                      <div className="text-sm text-gray-600">총 수량</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${complexity.color}`}>
                        {complexity.level}
                      </div>
                      <div className="text-sm text-gray-600">복잡도</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        ₩{totalCost.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">총 원가</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  추가 정보
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      상세 설명
                    </label>
                    <textarea
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-main-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      rows={4}
                      placeholder="BOM에 대한 상세 설명을 입력하세요"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                취소
              </Button>
              <Button variant="default" onClick={handleSave} loading={loading}>
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showItemModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-semibold">원자재 선택</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="border-b bg-gray-50 p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="원자재명 또는 품목코드로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="grid gap-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.itemCode}
                    className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50"
                    onClick={() => handleAddItem(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                            {item.itemCode}
                          </span>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            원자재
                          </span>
                        </div>
                        <h4 className="mb-1 font-semibold text-gray-900">
                          {item.itemName}
                        </h4>
                        <p className="mb-2 text-sm text-gray-600">
                          {item.category}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>단위: {item.unit}</span>
                          <span>재고: {item.currentStock}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₩{item.standardPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">단가</div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="py-12 text-center text-gray-500">
                    <i className="ri-search-line mb-4 text-4xl"></i>
                    <p>검색 조건에 맞는 원자재가 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
