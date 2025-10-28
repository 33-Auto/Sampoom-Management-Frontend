import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/app/providers/NotificationContext";
import { workCenterMasterData } from "@/mocks/factoryData";
import { Button, Input, Select } from "@/shared/ui";

export default function RoutingCreate() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    itemCode: "",
    itemName: "",
    version: "1.0",
    status: "active",
    description: "",
  });

  const [processes, setProcesses] = useState([
    {
      id: 1,
      sequence: 1,
      processName: "",
      workCenter: "",
      setupTime: "",
      processTime: "",
      waitTime: "",
      description: "",
    },
  ]);

  // 품목 마스터 데이터 (실제로는 API에서 가져와야 함)
  const itemMasterData = [
    { value: "", label: "품목을 선택하세요" },
    { value: "ITEM001", label: "ITEM001 - 정밀 가공 부품" },
    { value: "ITEM002", label: "ITEM002 - 스테인리스 볼트" },
    { value: "ITEM003", label: "ITEM003 - 알루미늄 하우징" },
    { value: "ITEM004", label: "ITEM004 - 전자 센서 모듈" },
    { value: "ITEM005", label: "ITEM005 - 플라스틱 커버" },
  ];

  const statusOptions = [
    { value: "active", label: "활성" },
    { value: "review", label: "검토중" },
    { value: "inactive", label: "비활성" },
  ];

  // 작업장 옵션을 작업장 마스터 데이터에서 가져오기
  const workCenterOptions = [
    { value: "", label: "작업장 선택" },
    ...workCenterMasterData
      .filter((wc) => wc.status === "가동")
      .map((wc) => ({
        value: wc.workCenterCode,
        label: `${wc.workCenterCode} - ${wc.workCenterName}`,
      })),
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 품목 선택 시 품목명 자동 설정
    if (field === "itemCode") {
      const selectedItem = itemMasterData.find((item) => item.value === value);
      if (selectedItem) {
        const itemName = selectedItem.label.split(" - ")[1] || "";
        setFormData((prev) => ({
          ...prev,
          itemName: itemName,
        }));
      }
    }
  };

  const handleProcessChange = (index: number, field: string, value: string) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index] = {
      ...updatedProcesses[index],
      [field]: value,
    };
    setProcesses(updatedProcesses);
  };

  const addProcess = () => {
    const newProcess = {
      id: Date.now(),
      sequence: processes.length + 1,
      processName: "",
      workCenter: "",
      setupTime: "",
      processTime: "",
      waitTime: "",
      description: "",
    };
    setProcesses([...processes, newProcess]);
  };

  const removeProcess = (index: number) => {
    if (processes.length > 1) {
      const updatedProcesses = processes.filter((_, i) => i !== index);
      // 순서 재정렬
      const reorderedProcesses = updatedProcesses.map((process, i) => ({
        ...process,
        sequence: i + 1,
      }));
      setProcesses(reorderedProcesses);
    }
  };

  const calculateTotalTime = (process: any) => {
    const setup = parseFloat(process.setupTime) || 0;
    const processTime = parseFloat(process.processTime) || 0;
    const wait = parseFloat(process.waitTime) || 0;
    return setup + processTime + wait;
  };

  const getTotalLeadTime = () => {
    return processes.reduce(
      (total, process) => total + calculateTotalTime(process),
      0,
    );
  };

  const validateForm = () => {
    if (!formData.itemCode) {
      showError("입력 오류", "품목을 선택해주세요.");
      return false;
    }

    const incompleteProcesses = processes.filter(
      (p) => !p.processName || !p.workCenter,
    );
    if (incompleteProcesses.length > 0) {
      showError("입력 오류", "모든 공정의 필수 정보를 입력해주세요.");
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

      showSuccess("등록 완료", "공정이 성공적으로 등록되었습니다.");
      navigate("/master/routings");
    } catch {
      showError("등록 실패", "공정 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/master/routings");
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
                공정 신규 등록
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              새로운 공정 정보를 입력하여 등록합니다.
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
                  <Select
                    label="품목 선택"
                    options={itemMasterData}
                    value={formData.itemCode}
                    onChange={(e) =>
                      handleInputChange("itemCode", e.target.value)
                    }
                    helperText="공정을 적용할 품목을 선택하세요"
                  />
                  <Input
                    label="품목명"
                    placeholder="품목명이 자동으로 표시됩니다"
                    value={formData.itemName}
                    disabled
                    helperText="선택한 품목의 이름이 표시됩니다"
                  />
                  <Input
                    label="버전"
                    placeholder="1.0"
                    value={formData.version}
                    onChange={(e) =>
                      handleInputChange("version", e.target.value)
                    }
                    helperText="공정의 버전을 입력하세요"
                  />
                  <Select
                    label="상태"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* 공정 순서 */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    공정 순서
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      총 리드타임:{" "}
                      <span className="font-medium">
                        {getTotalLeadTime()}분
                      </span>
                    </div>
                    <Button variant="secondary" size="sm" onClick={addProcess}>
                      <i className="ri-add-line mr-2"></i>
                      공정 추가
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {processes.map((process, index) => (
                    <div
                      key={process.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-main-500 text-sm font-medium text-white">
                            {process.sequence}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            공정 {process.sequence}
                          </span>
                        </div>
                        {processes.length > 1 && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => removeProcess(index)}
                          >
                            <i className="ri-delete-bin-line text-red-5 0"></i>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Input
                          label="공정명"
                          placeholder="CNC 가공"
                          value={process.processName}
                          onChange={(e) =>
                            handleProcessChange(
                              index,
                              "processName",
                              e.target.value,
                            )
                          }
                        />
                        <div className="w-full">
                          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            작업장
                          </label>
                          <Select
                            options={workCenterOptions}
                            value={process.workCenter}
                            onChange={(e) =>
                              handleProcessChange(
                                index,
                                "workCenter",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <Input
                          label="준비시간 (분)"
                          type="number"
                          placeholder="30"
                          value={process.setupTime}
                          onChange={(e) =>
                            handleProcessChange(
                              index,
                              "setupTime",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          label="가공시간 (분)"
                          type="number"
                          placeholder="120"
                          value={process.processTime}
                          onChange={(e) =>
                            handleProcessChange(
                              index,
                              "processTime",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          label="대기시간 (분)"
                          type="number"
                          placeholder="15"
                          value={process.waitTime}
                          onChange={(e) =>
                            handleProcessChange(
                              index,
                              "waitTime",
                              e.target.value,
                            )
                          }
                        />
                        <div className="flex items-end">
                          <div className="w-full">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                              소계 (분)
                            </label>
                            <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                              {calculateTotalTime(process)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          공정 설명
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-main-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                          rows={2}
                          placeholder="공정에 대한 상세 설명을 입력하세요"
                          value={process.description}
                          onChange={(e) =>
                            handleProcessChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
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
                      공정 설명
                    </label>
                    <textarea
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-main-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                      rows={4}
                      placeholder="전체 공정에 대한 설명을 입력하세요"
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
}
