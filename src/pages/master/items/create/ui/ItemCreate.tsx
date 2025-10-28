import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Input, Select } from "@/shared/ui";

export const ItemCreate = () => {
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
  });

  const itemTypes = [
    { value: "", label: "품목 유형 선택" },
    { value: "raw", label: "원자재" },
    { value: "semi", label: "반제품" },
    { value: "finished", label: "완제품" },
    { value: "consumable", label: "소모품" },
    { value: "tool", label: "공구" },
  ];

  const categories = [
    { value: "", label: "카테고리 선택" },
    { value: "electronics", label: "전자부품" },
    { value: "mechanical", label: "기계부품" },
    { value: "chemical", label: "화학제품" },
    { value: "packaging", label: "포장재" },
    { value: "office", label: "사무용품" },
  ];

  const units = [
    { value: "", label: "단위 선택" },
    { value: "ea", label: "개" },
    { value: "kg", label: "kg" },
    { value: "liter", label: "리터" },
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
    return true;
  };

  const generateItemCode = () => {
    const typePrefix = {
      raw: "RAW",
      semi: "SEMI",
      finished: "FIN",
      consumable: "CON",
      tool: "TOOL",
    };

    const prefix =
      typePrefix[formData.type as keyof typeof typePrefix] || "ITM";
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${randomNum}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 품목 코드 자동 생성
      const generatedCode = generateItemCode();

      // 실제 API 호출 시뮬레이션
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
          {/* 페이지 헤더 */}
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

          {/* 등록 폼 */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
            <div className="space-y-8">
              {/* 기본 정보 */}
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
                    onChange={(e) => handleInputChange("type", e.target.value)}
                  />
                  <Select
                    label="카테고리"
                    options={categories}
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
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

              {/* 가격 정보 */}
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
                </div>
              </div>

              {/* 재고 관리 */}
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
                  <Input
                    label="리드타임 (일)"
                    type="number"
                    placeholder="7"
                    value={formData.leadTime}
                    onChange={(e) =>
                      handleInputChange("leadTime", e.target.value)
                    }
                    helperText="조달 소요 일수"
                  />
                </div>
              </div>

              {/* 공급업체 정보 */}
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

              {/* 추가 정보 */}
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

            {/* 버튼 영역 */}
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
};
