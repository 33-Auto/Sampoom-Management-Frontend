import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Input, Select } from "@/shared/ui";

export default function ItemCreate() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    unit: "",
    standardPrice: "",
    purchasePrice: "",
    safetyStock: "",
    leadTime: "",
    supplier: "",
    description: "",
    status: "active",
    procurementType: "",
  });

  const itemTypes = [
    { value: "", label: "품목 유형 선택" },
    { value: "원자재", label: "원자재" },
    { value: "부품", label: "부품" },
  ];

  const rawMaterialCategories = [
    { value: "", label: "카테고리 선택" },
    {
      value: "원자재 > 금속 > 스테인리스",
      label: "원자재 > 금속 > 스테인리스",
    },
    { value: "원자재 > 금속 > 알루미늄", label: "원자재 > 금속 > 알루미늄" },
    { value: "원자재 > 고무 > 실리콘", label: "원자재 > 고무 > 실리콘" },
    { value: "원자재 > 전자부품 > 기판", label: "원자재 > 전자부품 > 기판" },
    { value: "원자재 > 금속 > 티타늄", label: "원자재 > 금속 > 티타늄" },
  ];

  const partCategories = [
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

  const units = [
    { value: "", label: "단위 선택" },
    { value: "ea", label: "개" },
    { value: "kg", label: "kg" },
    { value: "eared", label: "리터" },
    { value: "meter", label: "미터" },
    { value: "box", label: "박스" },
  ];

  const suppliers = [
    { value: "", label: "공급업체 선택" },
    { value: "supplier1", label: "(주)한국부품" },
    { value: "supplier2", label: "대한전자" },
    { value: "supplier3", label: "글로벌머티리얼" },
    { value: "supplier4", label: "프리미엄소재" },
  ];

  const statusOptions = [
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" },
    { value: "discontinued", label: "단종" },
  ];

  const procurementOptions = [
    { value: "", label: "조달 유형 선택" },
    { value: "구매", label: "구매 (External)" },
    { value: "생산", label: "생산 (Internal)" },
    { value: "혼합", label: "혼합 (Both)" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showError("입력 오류", "품목명을 입력해주세요.");
      return false;
    }
    if (!formData.type) {
      showError("입력 오류", "품목 유형을 선택해주세요.");
      return false;
    }
    if (!formData.category) {
      showError("입력 오류", "카테고리를 선택해주세요.");
      return false;
    }
    if (!formData.procurementType) {
      showError("입력 오류", "조달 유형을 선택해주세요.");
      return false;
    }
    return true;
  };

  const generateItemCode = () => {
    const typePrefix = {
      원자재: "MAT",
      부품: "SEMI",
    };

    const prefix =
      typePrefix[formData.type as keyof typeof typePrefix] || "ITM";
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${randomNum}`;
  };

  const getCategoryOptions = () => {
    if (formData.type === "원자재") {
      return rawMaterialCategories;
    } else if (formData.type === "부품") {
      return partCategories;
    }
    return [{ value: "", label: "먼저 품목 유형을 선택하세요" }];
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const generatedCode = generateItemCode();

      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccess(
        "등록 완료",
        `품목이 성공적으로 등록되었습니다. (코드: ${generatedCode})`,
      );
      navigate("/master/items");
    } catch {
      showError("등록 실패", "품목 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/master/items");
  };

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
                품목 신규 등록
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              새로운 품목 정보를 입력하여 등록합니다. 품목 코드는 자동으로
              생성됩니다.
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
                    label="품목명"
                    placeholder="스테인리스 볼트"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <Select
                    label="품목 유형"
                    options={itemTypes}
                    value={formData.type}
                    onChange={(e) => {
                      handleInputChange("type", e.target.value);
                      handleInputChange("category", "");
                    }}
                  />
                  <Select
                    label="카테고리"
                    options={getCategoryOptions()}
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    disabled={!formData.type}
                  />
                  <Select
                    label="조달 유형"
                    options={procurementOptions}
                    value={formData.procurementType}
                    onChange={(e) =>
                      handleInputChange("procurementType", e.target.value)
                    }
                  />
                  <Select
                    label="기본 단위"
                    options={units}
                    value={formData.unit}
                    onChange={(e) => handleInputChange("unit", e.target.value)}
                  />
                  <Select
                    label="품목 상태"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  가격 정보
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="표준 단가"
                    type="number"
                    placeholder="1000"
                    value={formData.standardPrice}
                    onChange={(e) =>
                      handleInputChange("standardPrice", e.target.value)
                    }
                    helperText="원 단위로 입력"
                  />
                  {(formData.procurementType === "구매" ||
                    formData.procurementType === "혼합") && (
                    <Input
                      label="구매 단가"
                      type="number"
                      placeholder="800"
                      value={formData.purchasePrice}
                      onChange={(e) =>
                        handleInputChange("purchasePrice", e.target.value)
                      }
                      helperText="원 단위로 입력"
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  재고 관리
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="안전 재고"
                    type="number"
                    placeholder="100"
                    value={formData.safetyStock}
                    onChange={(e) =>
                      handleInputChange("safetyStock", e.target.value)
                    }
                    helperText="최소 보유 수량"
                  />
                  {(formData.procurementType === "구매" ||
                    formData.procurementType === "혼합") && (
                    <Input
                      label="구매 리드타임 (일)"
                      type="number"
                      placeholder="7"
                      value={formData.leadTime}
                      onChange={(e) =>
                        handleInputChange("leadTime", e.target.value)
                      }
                      helperText="발주부터 입고까지 소요 일수"
                    />
                  )}
                  {(formData.procurementType === "생산" ||
                    formData.procurementType === "혼합") && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <div className="mb-2 flex items-center space-x-2">
                        <i className="ri-information-line text-blue-600"></i>
                        <span className="text-sm font-medium text-blue-900">
                          생산 리드타임 안내
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">
                        생산 리드타임은 공정 마스터에서 자동으로 계산됩니다.
                        공정 등록 후 확인하실 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {(formData.procurementType === "구매" ||
                formData.procurementType === "혼합") && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                    공급업체 정보
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Select
                      label="주 공급업체"
                      options={suppliers}
                      value={formData.supplier}
                      onChange={(e) =>
                        handleInputChange("supplier", e.target.value)
                      }
                    />
                    <div></div>
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
                      placeholder="품목에 대한 상세 설명을 입력하세요"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
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
              <Button
                variant="default"
                onClick={handleSubmit}
                loading={loading}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
