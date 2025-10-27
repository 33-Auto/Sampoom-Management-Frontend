import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { materialMasterData } from "@/mocks/factoryData";
import { Button, Input } from "@/shared/ui";

interface BOMItem {
  id: string;
  itemCode: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

const CreateBOM: React.FC = () => {
  const navigate = useNavigate();
  const [bomCode, setBomCode] = useState("");
  const [bomName, setBomName] = useState("");
  const [version, setVersion] = useState("1.0");
  const [description, setDescription] = useState("");
  const [bomItems, setBomItems] = useState<BOMItem[]>([]);
  const [showItemModal, setShowItemModal] = useState(false);

  const handleAddItem = (item: any) => {
    const newItem: BOMItem = {
      id: Date.now().toString(),
      itemCode: item.itemCode,
      itemName: item.itemName,
      quantity: 1,
      unit: item.unit,
      unitCost: item.standardPrice,
      totalCost: item.standardPrice,
    };
    setBomItems([...bomItems, newItem]);
    setShowItemModal(false);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setBomItems(
      bomItems.map((item) =>
        item.id === id
          ? { ...item, quantity, totalCost: quantity * item.unitCost }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setBomItems(bomItems.filter((item) => item.id !== id));
  };

  const totalCost = bomItems.reduce((sum, item) => sum + item.totalCost, 0);

  const handleSave = () => {
    if (!bomCode || !bomName || bomItems.length === 0) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    // 저장 로직 구현
    console.log("BOM 저장:", {
      bomCode,
      bomName,
      version,
      description,
      items: bomItems,
      totalCost,
    });

    navigate("/master/bom");
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">새 BOM 생성</h1>
          <p className="mt-1 text-gray-600">제품의 자재 명세서를 생성합니다</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={async () => navigate("/master/bom")}
          >
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* BOM 기본 정보 */}
        <div className="lg:col-span-2">
          <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">BOM 기본 정보</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="BOM 코드"
                value={bomCode}
                onChange={(e) => setBomCode(e.target.value)}
                placeholder="예: BOM-001"
                required
              />
              <Input
                label="BOM 명"
                value={bomName}
                onChange={(e) => setBomName(e.target.value)}
                placeholder="예: 엔진 어셈블리 A-Type"
                required
              />
              <Input
                label="버전"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="예: 1.0"
              />
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="BOM에 대한 상세 설명을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 자재 목록 */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">자재 목록</h2>
              <Button
                onClick={() => setShowItemModal(true)}
                className="flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                품목 선택
              </Button>
            </div>

            {bomItems.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <i className="ri-inbox-line mb-4 text-4xl"></i>
                <p>등록된 자재가 없습니다.</p>
                <p className="text-sm">
                  품목 선택 버튼을 클릭하여 자재를 추가하세요.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left">품목 코드</th>
                      <th className="px-4 py-3 text-left">품목명</th>
                      <th className="px-4 py-3 text-center">수량</th>
                      <th className="px-4 py-3 text-center">단위</th>
                      <th className="px-4 py-3 text-right">단가</th>
                      <th className="px-4 py-3 text-right">총액</th>
                      <th className="px-4 py-3 text-center">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">
                          {item.itemCode}
                        </td>
                        <td className="px-4 py-3">{item.itemName}</td>
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
                            className="w-20 rounded border px-2 py-1 text-center"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">{item.unit}</td>
                        <td className="px-4 py-3 text-right">
                          ₩{item.unitCost.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ₩{item.totalCost.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* 요약 정보 */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">요약 정보</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">총 자재 수:</span>
                <span className="font-semibold">{bomItems.length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">총 수량:</span>
                <span className="font-semibold">
                  {bomItems.reduce((sum, item) => sum + item.quantity, 0)}개
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">총 원가:</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₩{totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="mb-2 font-semibold text-blue-900">
              <i className="ri-information-line mr-2"></i>
              BOM 생성 가이드
            </h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• BOM 코드는 고유해야 합니다</li>
              <li>• 최소 1개 이상의 자재가 필요합니다</li>
              <li>• 수량은 1 이상이어야 합니다</li>
              <li>• 저장 후 수정이 가능합니다</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 품목 선택 모달 */}
      {showItemModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 max-h-[80vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-lg font-semibold">품목 선택</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-6">
              <div className="grid gap-4">
                {materialMasterData
                  .filter((item) => item.status === "활성")
                  .map((item) => (
                    <div
                      key={item.itemCode}
                      className="cursor-pointer rounded-lg border p-4 hover:bg-gray-50"
                      onClick={() => handleAddItem(item)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                              {item.itemCode}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                item.itemType === "원자재"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.itemType}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900">
                            {item.itemName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span>단위: {item.unit}</span>
                            <span>
                              단가: ₩{item.standardPrice.toLocaleString()}
                            </span>
                            <span>재고: {item.currentStock}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            ₩{item.standardPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {"supplier" in item ? String(item.supplier) : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBOM;
