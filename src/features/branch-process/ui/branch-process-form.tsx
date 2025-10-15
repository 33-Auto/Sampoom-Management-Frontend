import { useEffect, useState } from "react";import { useNotification } from "@/shared/lib";import { Button, Input, Select } from "@/shared/ui";import { useCreateBranchMutation, useDeleteBranchMutation, useUpdateBranchMutation } from "../api/branch-process.api";import type { BranchProcessFormProps } from "../model/branch-process.types";export function BranchProcessForm({
  branchId,
  branchData,
  onSuccess,
  onCancel,
}: BranchProcessFormProps) {
  const isEditMode = !!branchId;
  const { showSuccess, showError, showConfirm } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    type: "WAREHOUSE" as "WAREHOUSE" | "FACTORY",
    address: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  // branchData가 있으면 폼 초기값 설정
  useEffect(() => {
    if (branchData) {
      setFormData({
        name: branchData.name || "",
        type: branchData.type || "WAREHOUSE",
        address: branchData.address || "",
        status: branchData.status || "ACTIVE",
      });
    }
  }, [branchData]);

  const createMutation = useCreateBranchMutation();
  const updateMutation = useUpdateBranchMutation();
  const deleteMutation = useDeleteBranchMutation();

  const typeOptions = [
    { value: "WAREHOUSE", label: "창고" },
    { value: "FACTORY", label: "공장" },
  ];

  const statusOptions = [
    { value: "ACTIVE", label: "활성" },
    { value: "INACTIVE", label: "비활성" },
  ];

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      showError("입력 오류", "지점명을 입력해주세요.");
      return;
    }

    if (!formData.address.trim()) {
      showError("입력 오류", "주소를 입력해주세요.");
      return;
    }

    if (isEditMode) {
      // 수정 모드 - type은 제외 (수정 불가)
      updateMutation.mutate(
        {
          params: {
            path: {
              id: branchId!,
            },
          },
          body: {
            name: formData.name,
            address: formData.address,
            status: formData.status,
          },
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "지점이 성공적으로 수정되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("수정 실패", "지점 수정에 실패했습니다.");
          },
        },
      );
    } else {
      // 생성 모드 - type 포함
      createMutation.mutate(
        {
          body: {
            name: formData.name,
            type: formData.type,
            address: formData.address,
            status: formData.status,
          },
        },
        {
          onSuccess: () => {
            showSuccess("생성 완료", "지점이 성공적으로 생성되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("생성 실패", "지점 생성에 실패했습니다.");
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!branchId) return;

    showConfirm({
      title: "지점 삭제",
      message: `"${branchData?.name || ""}" 지점을 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
      onConfirm: () => {
        deleteMutation.mutate(
          {
            params: {
              path: {
                id: branchId,
              },
            },
          },
          {
            onSuccess: () => {
              showSuccess("삭제 완료", "지점이 성공적으로 삭제되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("삭제 실패", "지점 삭제에 실패했습니다.");
            },
          },
        );
      },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-bg-card-black">
      <div className="space-y-8 p-6">
        {/* 기본 정보 */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            기본 정보
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="지점명"
                placeholder="지점명을 입력하세요"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                helperText="지점의 이름을 입력하세요"
              />
            </div>
            {!isEditMode && (
              <Select
                label="유형"
                options={typeOptions}
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "WAREHOUSE" | "FACTORY",
                  })
                }
                helperText="지점 유형을 선택하세요 (수정 불가)"
              />
            )}
            {isEditMode && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  유형
                </label>
                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {formData.type === "WAREHOUSE" ? "창고" : "공장"}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  지점 유형은 수정할 수 없습니다
                </p>
              </div>
            )}
            <Select
              label="상태"
              options={statusOptions}
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "ACTIVE" | "INACTIVE",
                })
              }
            />
            <div className="md:col-span-2">
              <Input
                label="주소"
                placeholder="서울시 강남구 테헤란로 123"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                helperText="지점 주소를 입력하세요"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-between border-t border-gray-200 p-6 dark:border-gray-700">
        <div>
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleteMutation.isPending}
            >
              <i className="ri-delete-bin-line mr-2"></i>
              삭제
            </Button>
          )}
        </div>
        <div className="flex space-x-4">
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button
            variant="default"
            onClick={handleSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
          >
            <i className="ri-save-line mr-2"></i>
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
