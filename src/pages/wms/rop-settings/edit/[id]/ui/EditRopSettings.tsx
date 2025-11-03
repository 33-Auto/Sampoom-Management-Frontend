import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, InfoBox, Input, Select, StatCard } from "@/shared/ui";

// 창고 더미 데이터에는 품목 마스터가 없으므로 로컬 품목 데이터로 대체
const materialMasterData = [
  {
    itemCode: "GBX-001",
    itemName: "기어박스 어셈블리",
    unit: "EA",
    itemType: "부품",
    category: "부품 > 기계 > 동력전달 > 기어박스",
  },
  {
    itemCode: "ASM-100",
    itemName: "동력전달 어셈블리",
    unit: "SET",
    itemType: "부품",
    category: "부품 > 기계 > 동력전달 > 어셈블리",
  },
  {
    itemCode: "LED-010",
    itemName: "LED 모듈",
    unit: "EA",
    itemType: "부품",
    category: "부품 > 전기 > 조명 > LED모듈",
  },
  {
    itemCode: "PLH-200",
    itemName: "플라스틱 하우징",
    unit: "EA",
    itemType: "부품",
    category: "부품 > 플라스틱 > 외장재 > 하우징",
  },
  {
    itemCode: "BRK-300",
    itemName: "브레이크 모듈",
    unit: "EA",
    itemType: "부품",
    category: "부품 > 안전 > 제동 > 브레이크",
  },
  {
    itemCode: "SUS-400",
    itemName: "서스펜션 모듈",
    unit: "EA",
    itemType: "부품",
    category: "부품 > 섀시 > 현가장치 > 서스펜션",
  },
  {
    itemCode: "CUS-500",
    itemName: "시트 쿠션",
    unit: "EA",
    itemType: "부품",
    category: "부품 > 내장 > 시트 > 쿠션",
  },
  {
    itemCode: "MOD-600",
    itemName: "제어 모듈",
    unit: "EA",
    itemType: "부품",
    category: "부품 > 전자 > 제어 > 모듈",
  },
];

export function EditRopSettings() {
  const navigate = useNavigate();
  const { id } = useParams();
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
    autoOrder: false,
    currentStock: 0,
    reorderPoint: 0,
    status: "active",
  });

  // 추가된 상태 변수들
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

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

  // 상태 옵션
  const statusOptions = [
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" },
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
  };

  // 그룹 변경 시 품목 초기화
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedItem("");
  };

  // 품목 변경 시 품목 코드와 이름 자동 생성
  const handleItemChange = (value: string) => {
    setSelectedItem(value);
    if (selectedCategory && selectedGroup && value) {
      // 품목 마스터 데이터에서 해당하는 품목 찾기
      const fullCategory = `부품 > ${selectedCategory} > ${selectedGroup} > ${value}`;
      const matchingItem = materialMasterData.find(
        (item) => item.category === fullCategory && item.itemType === "부품",
      );

      if (matchingItem) {
        setFormData((prev) => ({
          ...prev,
          itemCode: matchingItem.itemCode,
          itemName: matchingItem.itemName,
          unit: matchingItem.unit || "EA",
        }));
      } else {
        // 매칭되는 품목이 없으면 기본값 설정
        const tempCode = `PART-${selectedCategory.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-3)}`;
        setFormData((prev) => ({
          ...prev,
          itemCode: tempCode,
          itemName: `${selectedCategory} ${selectedGroup} ${value}`,
          unit: "EA",
        }));
      }
    }
  };

  // 기존 데이터 로드
  useEffect(() => {
    if (id) {
      // 실제로는 API에서 데이터를 가져와야 함
      const mockData = {
        id: id,
        category: "원자재",
        group: "금속",
        itemCode: "RM-AL-001",
        itemName: "알루미늄 합금 판재",
        unit: "KG",
        supplier: "한국금속공업",
        leadTime: 5,
        avgConsumption: 15,
        maxStock: 300,
        autoOrder: false,
        currentStock: 120,
        reorderPoint: 75,
        status: "active",
      };
      setFormData(mockData);

      // 카테고리 정보 파싱해서 설정
      setSelectedCategory("기계");
      setSelectedGroup("동력전달");
      setSelectedItem("기어박스");
    }
  }, [id]);

  const handleAutoOrderChange = (checked: boolean) => {
    setFormData({
      ...formData,
      autoOrder: checked,
    });
  };

  const handleSave = () => {
    if (!formData.itemCode || !formData.itemName) {
      alert("품목을 선택해주세요.");
      return;
    }

    if (!formData.supplier) {
      alert("공급업체를 입력해주세요.");
      return;
    }

    const calculatedRop = formData.avgConsumption * formData.leadTime;

    const updatedRopSetting = {
      ...formData,
      reorderPoint: calculatedRop,
      lastUpdated: new Date().toISOString().split("T")[0],
      lastCalculated: new Date().toISOString().split("T")[0],
      leadTimeSource: formData.autoOrder ? "auto" : "manual",
      avgConsumptionSource: formData.autoOrder ? "auto" : "manual",
    };

    console.log("ROP 설정 수정:", updatedRopSetting);
    alert("ROP 설정이 수정되었습니다.");
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
              ROP 설정 수정
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            기존 품목의 재주문점(ROP) 설정을 수정합니다.
          </p>
        </div>

        {/* 메인 폼 */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
          <div className="space-y-8 p-6">
            {/* 현재 상태 */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                현재 상태
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <StatCard
                  icon="ri-stack-line"
                  label="현재고"
                  value={`${formData.currentStock} ${formData.unit}`}
                  iconBgColor="bg-blue-100"
                  iconColor="text-blue-600"
                />
                <StatCard
                  icon="ri-alert-line"
                  label="재주문점"
                  value={`${formData.reorderPoint} ${formData.unit}`}
                  iconBgColor="bg-orange-100"
                  iconColor="text-orange-600"
                />
                <StatCard
                  icon="ri-checkbox-circle-line"
                  label="상태"
                  value={formData.status === "active" ? "활성" : "비활성"}
                  iconBgColor={
                    formData.status === "active"
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }
                  iconColor={
                    formData.status === "active"
                      ? "text-green-600"
                      : "text-gray-600"
                  }
                />
              </div>
            </div>

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

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <Input
                  label="품목 코드"
                  value={formData.itemCode}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <Input
                  label="품목명"
                  value={formData.itemName}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
                <Input
                  label="단위"
                  value={formData.unit}
                  disabled
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>

              {/* 선택된 품목 정보 표시 */}
              {selectedCategory && selectedGroup && selectedItem && (
                <InfoBox type="info" title="선택된 품목">
                  <p className="text-sm">
                    <strong>전체 카테고리:</strong> 부품 &gt; {selectedCategory}{" "}
                    &gt; {selectedGroup} &gt; {selectedItem}
                  </p>
                  <p className="mt-1 text-sm">
                    <strong>품목 코드:</strong> {formData.itemCode} |{" "}
                    <strong>품목명:</strong> {formData.itemName}
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
                <Input
                  label="공급업체 *"
                  type="text"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  placeholder="예: 한국금속공업"
                />
                <Select
                  label="상태"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
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
                <InfoBox type="warning" title="자동 계산 모드">
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
