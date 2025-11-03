import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Card, Input, Select } from "@/shared/ui";

export const CreateWorkCenter = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    workCenterName: "",
    type: "internal",
    dailyCapacity: "",
    efficiency: "",
    hourlyRate: "",
    status: "active",
    description: "",
  });

  const typeOptions = [
    { value: "internal", label: "내부 작업장" },
    { value: "external", label: "외부 작업장" },
  ];

  const statusOptions = [
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" },
    { value: "maintenance", label: "정비중" },
  ];

  const generateWorkCenterCode = (name: string, type: string) => {
    if (!name) return "";

    const prefix = type === "internal" ? "WC" : "EXT";
    const nameCode = name.substring(0, 3);
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${nameCode}${randomNum}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.workCenterName.trim()) {
      showError("입력 오류", "작업장명을 입력해주세요.");
      return false;
    }
    if (!formData.dailyCapacity || parseFloat(formData.dailyCapacity) <= 0) {
      showError("입력 오류", "일일 가동시간을 올바르게 입력해주세요.");
      return false;
    }
    if (
      !formData.efficiency ||
      parseFloat(formData.efficiency) <= 0 ||
      parseFloat(formData.efficiency) > 100
    ) {
      showError("입력 오류", "효율성을 1-100 사이의 값으로 입력해주세요.");
      return false;
    }
    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
      showError("입력 오류", "시간당 비용을 올바르게 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const generatedCode = generateWorkCenterCode(
        formData.workCenterName,
        formData.type,
      );
      showSuccess(
        "등록 완료",
        `작업장 ${generatedCode}가 성공적으로 등록되었습니다.`,
      );
      navigate("/master/workcenters");
    } catch {
      showError("등록 실패", "작업장 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/master/workcenters");
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
                작업장 신규 등록
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              새로운 작업장 정보를 입력하여 등록합니다. 작업장 코드는 자동으로
              생성됩니다.
            </p>
          </div>

          {/* 등록 폼 */}
          <Card className="dark:border-gray-700 dark:bg-bg-card-black">
            <div className="space-y-8">
              {/* 기본 정보 */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  기본 정보
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Input
                      label="작업장명"
                      placeholder="절삭 가공 1호기"
                      value={formData.workCenterName}
                      onChange={(e) =>
                        handleInputChange("workCenterName", e.target.value)
                      }
                      helperText="작업장의 이름을 입력하세요 (코드는 자동 생성됩니다)"
                    />
                  </div>
                  <Select
                    label="작업장 유형"
                    options={typeOptions}
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                  />
                  <Select
                    label="작업장 상태"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* 운영 정보 */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  운영 정보
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input
                    label="일일 가동시간"
                    type="number"
                    placeholder="8"
                    value={formData.dailyCapacity}
                    onChange={(e) =>
                      handleInputChange("dailyCapacity", e.target.value)
                    }
                    helperText="시간 단위로 입력"
                  />
                  <Input
                    label="효율성"
                    type="number"
                    placeholder="85"
                    min="1"
                    max="100"
                    value={formData.efficiency}
                    onChange={(e) =>
                      handleInputChange("efficiency", e.target.value)
                    }
                    helperText="% 단위로 입력 (1-100)"
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="시간당 비용"
                      type="number"
                      placeholder="45000"
                      value={formData.hourlyRate}
                      onChange={(e) =>
                        handleInputChange("hourlyRate", e.target.value)
                      }
                      helperText="원 단위로 입력"
                    />
                  </div>
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
                      placeholder="작업장에 대한 상세 설명을 입력하세요"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 코드 미리보기 */}
              {formData.workCenterName && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    생성될 작업장 코드 미리보기
                  </h3>
                  <p className="font-mono text-lg font-bold text-main-600 dark:text-main-400">
                    {generateWorkCenterCode(
                      formData.workCenterName,
                      formData.type,
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    * 실제 저장 시 고유성을 위해 번호가 조정될 수 있습니다
                  </p>
                </div>
              )}
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
          </Card>
        </div>
      </div>
    </>
  );
};
