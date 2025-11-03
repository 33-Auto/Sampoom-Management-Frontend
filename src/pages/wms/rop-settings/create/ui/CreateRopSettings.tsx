import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, InfoBox, Input, Select } from "@/shared/ui";

export function CreateRopSettings() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    group: "",
    itemCode: "",
    itemName: "",
    unit: "EA",
    supplier: "",
    leadTime: 7,
    avgConsumption: 0,
    maxStock: 0,
    autoOrder: true,
  });

  // 카테고리 옵션 (부품 카테고리만)
  const categoryOptions = [
    { value: "", label: "카테고리 선택" },
    { value: "플라스틱", label: "플라스틱" },
    { value: "안전", label: "안전" },
    { value: "섀시", label: "섀시" },
    { value: "기계", label: "기계" },
    { value: "전기", label: "전기" },
    { value: "내장", label: "내장" },
    { value: "전자", label: "전자" },
  ];

  // 그룹 옵션 (카테고리에 따라 변경)
  const getGroupOptions = (category: string) => {
    const groupMap: {
      [key: string]: { value: string; label: string }[];
    } = {
      플라스틱: [
        { value: "", label: "그룹 선택" },
        { value: "외장재", label: "외장재" },
      ],
      안전: [
        { value: "", label: "그룹 선택" },
        { value: "제동", label: "제동" },
      ],
      섀시: [
        { value: "", label: "그룹 선택" },
        { value: "현가장치", label: "현가장치" },
      ],
      기계: [
        { value: "", label: "그룹 선택" },
        { value: "동력전달", label: "동력전달" },
      ],
      전기: [
        { value: "", label: "그룹 선택" },
        { value: "조명", label: "조명" },
      ],
      내장: [
        { value: "", label: "그룹 선택" },
        { value: "시트", label: "시트" },
      ],
      전자: [
        { value: "", label: "그룹 선택" },
        { value: "제어", label: "제어" },
      ],
    };
    return groupMap[category] || [{ value: "", label: "그룹 선택" }];
  };

  // 품목 옵션 (카테고리와 그룹에 따라 변경)
  const getItemOptions = (category: string, group: string) => {
    const itemMap: {
      [key: string]: { value: string; label: string }[];
    } = {
      플라스틱_외장재: [
        { value: "", label: "품목 선택" },
        { value: "하우징", label: "하우징" },
      ],
      안전_제동: [
        { value: "", label: "품목 선택" },
        { value: "브레이크", label: "브레이크" },
      ],
      섀시_현가장치: [
        { value: "", label: "품목 선택" },
        { value: "서스펜션", label: "서스펜션" },
      ],
      기계_동력전달: [
        { value: "", label: "품목 선택" },
        { value: "기어박스", label: "기어박스" },
        { value: "어셈블리", label: "어셈블리" },
      ],
      전기_조명: [
        { value: "", label: "품목 선택" },
        { value: "LED모듈", label: "LED모듈" },
      ],
      내장_시트: [
        { value: "", label: "품목 선택" },
        { value: "쿠션", label: "쿠션" },
      ],
      전자_제어: [
        { value: "", label: "품목 선택" },
        { value: "모듈", label: "모듈" },
      ],
    };
    const key = `${category}_${group}`;
    return itemMap[key] || [{ value: "", label: "품목 선택" }];
  };

  // 카테고리 변경 시 그룹과 품목 초기화
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedGroup("");
    setSelectedItem("");
    setItemCode("");
    setItemName("");
    setFormData({
      ...formData,
      category: value,
      group: "",
      itemCode: "",
      itemName: "",
    });
  };

  // 그룹 변경 시 품목 초기화
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedItem("");
    setItemCode("");
    setItemName("");
    setFormData({ ...formData, group: value, itemCode: "", itemName: "" });
  };

  // 품목 변경 시 품목 코드와 이름 자동 생성
  const handleItemChange = (value: string) => {
    setSelectedItem(value);
    if (selectedCategory && selectedGroup && value) {
      // 임시 코드 생성
      const tempCode = `PART-${selectedCategory.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-3)}`;
      const tempName = `${selectedCategory} ${selectedGroup} ${value}`;

      setItemCode(tempCode);
      setItemName(tempName);
      setFormData({
        ...formData,
        itemCode: tempCode,
        itemName: tempName,
      });
    }
  };

  const handleAutoOrderChange = (checked: boolean) => {
    setFormData({
      ...formData,
      autoOrder: checked,
      // 자동 발주 활성화 시 ROP 관련 필드들을 기본값으로 설정
      ...(checked && {
        leadTime: 7,
        avgConsumption: 10,
        maxStock: 200,
      }),
    });
  };

  const handleSave = () => {
    if (!itemCode || !itemName) {
      alert("품목을 선택해주세요.");
      return;
    }

    if (!formData.supplier) {
      alert("공급업체를 입력해주세요.");
      return;
    }

    const calculatedRop = formData.avgConsumption * formData.leadTime;

    const newRopSetting = {
      ...formData,
      itemCode,
      itemName,
      reorderPoint: calculatedRop,
      currentStock: 0,
      status: "active",
      lastUpdated: new Date().toISOString().split("T")[0],
      lastCalculated: new Date().toISOString().split("T")[0],
      leadTimeSource: "manual",
      avgConsumptionSource: "manual",
    };

    console.log("신규 ROP 설정 생성:", newRopSetting);
    navigate("/wms/rop-settings");
  };

  const handleCancel = () => {
    navigate("/wms/rop-settings");
  };

  const calculatedRop = formData.avgConsumption * formData.leadTime;

  return (
    <>
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <div className="mb-2 flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <i className="ri-arrow-left-line mr-2"></i>
              뒤로
            </Button>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              신규 ROP 설정
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            새로운 품목의 재주문점(ROP) 설정을 생성합니다.
          </p>
        </div>

        {/* 메인 폼 */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
          <div className="space-y-8 p-6">
            {/* 품목 정보 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                품목 정보
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Select
                  label="카테고리"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  options={categoryOptions}
                />
                <Select
                  label="그룹"
                  value={selectedGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  options={getGroupOptions(selectedCategory)}
                  disabled={!selectedCategory}
                />
                <Select
                  label="품목"
                  value={selectedItem}
                  onChange={(e) => handleItemChange(e.target.value)}
                  options={getItemOptions(selectedCategory, selectedGroup)}
                  disabled={!selectedGroup}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input label="품목 코드" value={itemCode} disabled />
                <Input label="품목명" value={itemName} disabled />
              </div>

              {/* 선택된 품목 정보 표시 */}
              {selectedCategory && selectedGroup && selectedItem && (
                <InfoBox type="info" title="선택된 품목" className="mt-6">
                  <p className="text-sm">
                    <strong>전체 카테고리:</strong> 부품 &gt; {selectedCategory}{" "}
                    &gt; {selectedGroup} &gt; {selectedItem}
                  </p>
                  <p className="mt-1 text-sm">
                    <strong>품목 코드:</strong> {itemCode} |{" "}
                    <strong>품목명:</strong> {itemName}
                  </p>
                </InfoBox>
              )}
            </div>

            {/* 기본 정보 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                기본 정보
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="단위" value={formData.unit} disabled />
                <Input
                  label="공급업체 *"
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  placeholder="예: 한국금속공업"
                />
              </div>
            </div>

            {/* 자동 발주 설정 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                자동 발주 설정
              </h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.autoOrder}
                    onChange={(e) => handleAutoOrderChange(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    자동 발주 활성화
                  </span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  자동 발주를 활성화하면 시스템이 과거 데이터를 기반으로 ROP
                  값을 자동 계산합니다.
                </p>
              </div>
            </div>

            {/* ROP 설정 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                ROP 설정
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Input
                    label="리드 타임 (일)"
                    type="number"
                    value={formData.leadTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadTime: Number(e.target.value),
                      })
                    }
                    min="1"
                    disabled={formData.autoOrder}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    발주부터 입고까지 소요 기간
                  </p>
                </div>
                <div>
                  <Input
                    label="평균 일일 소비량"
                    type="number"
                    value={formData.avgConsumption}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        avgConsumption: Number(e.target.value),
                      })
                    }
                    min="0"
                    step="0.1"
                    disabled={formData.autoOrder}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    하루 평균 사용량
                  </p>
                </div>
                <div>
                  <Input
                    label="최대 재고"
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxStock: Number(e.target.value),
                      })
                    }
                    min="0"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    발주 시 최대 보유 수량
                  </p>
                </div>
              </div>

              {formData.autoOrder && (
                <InfoBox type="warning" title="자동 계산 모드" className="mt-6">
                  <p className="text-sm">
                    자동 발주가 활성화되어 시스템이 과거 발주/입고 이력과 출고
                    이력을 분석하여 리드타임과 평균 소비량을 자동으로
                    계산합니다.
                  </p>
                </InfoBox>
              )}

              {/* ROP 계산 미리보기 */}
              <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                <h5 className="mb-2 font-semibold text-purple-900 dark:text-purple-200">
                  ROP 계산 미리보기
                </h5>
                <div className="text-sm text-purple-800 dark:text-purple-300">
                  <p>ROP = 평균 일일 소비량 × 리드 타임</p>
                  <p>
                    ROP = {formData.avgConsumption} × {formData.leadTime} ={" "}
                    <strong>
                      {calculatedRop} {formData.unit}
                    </strong>
                  </p>
                  {formData.maxStock > 0 && (
                    <p className="mt-2 text-purple-700 dark:text-purple-400">
                      재고가{" "}
                      <strong>
                        {calculatedRop} {formData.unit}
                      </strong>
                      에 도달하면{" "}
                      <strong>
                        {formData.maxStock} {formData.unit}
                      </strong>
                      까지 발주됩니다.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end space-x-4 border-t border-gray-200 p-6 dark:border-gray-700">
            <Button variant="secondary" onClick={handleCancel}>
              취소
            </Button>
            <Button variant="default" onClick={handleSave}>
              <i className="ri-save-line mr-2"></i>
              저장
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
