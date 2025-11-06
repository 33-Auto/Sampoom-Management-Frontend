import { useEffect, useState } from "react";

import { useNotification } from "@/app/providers/NotificationContext";
import { Button, Input, Select } from "@/shared/ui";

import {
  useCreatePartnerMutation,
  useDeletePartnerMutation,
  useUpdatePartnerMutation,
} from "../api/partner-process.api";
import type { PartnerProcessFormProps } from "../model/partner-process.types";

export function PartnerProcessForm({
  partnerId,
  partnerData,
  onSuccess,
  onCancel,
}: PartnerProcessFormProps) {
  const isEditMode = !!partnerId;
  const { showSuccess, showError, showConfirm } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    businessNumber: "",
    ceoName: "",
    address: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  // partnerData가 있으면 폼 초기값 설정
  useEffect(() => {
    if (partnerData) {
      setFormData({
        name: partnerData.name || "",
        businessNumber: partnerData.businessNumber || "",
        ceoName: partnerData.ceoName || "",
        address: partnerData.address || "",
        status: partnerData.status || "ACTIVE",
      });
    }
  }, [partnerData]);

  const createMutation = useCreatePartnerMutation();
  const updateMutation = useUpdatePartnerMutation();
  const deleteMutation = useDeletePartnerMutation();

  const statusOptions = [
    { value: "ACTIVE", label: "활성" },
    { value: "INACTIVE", label: "비활성" },
  ];

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      showError("입력 오류", "거래처명을 입력해주세요.");
      return;
    }

    if (!formData.businessNumber.trim()) {
      showError("입력 오류", "사업자번호를 입력해주세요.");
      return;
    }

    if (!formData.ceoName.trim()) {
      showError("입력 오류", "대표자명을 입력해주세요.");
      return;
    }

    if (!formData.address.trim()) {
      showError("입력 오류", "주소를 입력해주세요.");
      return;
    }

    if (isEditMode) {
      // 수정 모드
      updateMutation.mutate(
        {
          params: {
            path: {
              id: partnerId!,
            },
          },
          body: {
            name: formData.name,
            businessNumber: formData.businessNumber,
            ceoName: formData.ceoName,
            address: formData.address,
            status: formData.status,
          },
        },
        {
          onSuccess: () => {
            showSuccess("수정 완료", "거래처가 성공적으로 수정되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("수정 실패", "거래처 수정에 실패했습니다.");
          },
        },
      );
    } else {
      // 생성 모드
      createMutation.mutate(
        {
          body: {
            name: formData.name,
            businessNumber: formData.businessNumber,
            ceoName: formData.ceoName,
            address: formData.address,
            status: formData.status,
          },
        },
        {
          onSuccess: () => {
            showSuccess("생성 완료", "거래처가 성공적으로 생성되었습니다.");
            onSuccess?.();
          },
          onError: () => {
            showError("생성 실패", "거래처 생성에 실패했습니다.");
          },
        },
      );
    }
  };

  const handleDelete = () => {
    if (!partnerId) return;

    showConfirm({
      title: "거래처 삭제",
      message: `"${partnerData?.name || ""}" 거래처를 삭제하시겠습니까?`,
      confirmText: "삭제",
      cancelText: "취소",
      variant: "danger",
      onConfirm: () => {
        deleteMutation.mutate(
          {
            params: {
              path: {
                id: partnerId,
              },
            },
          },
          {
            onSuccess: () => {
              showSuccess("삭제 완료", "거래처가 성공적으로 삭제되었습니다.");
              onSuccess?.();
            },
            onError: () => {
              showError("삭제 실패", "거래처 삭제에 실패했습니다.");
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
                label="거래처명"
                placeholder="거래처명을 입력하세요"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                helperText="거래처의 이름을 입력하세요"
              />
            </div>
            <Input
              label="사업자번호"
              placeholder="123-45-67890"
              value={formData.businessNumber}
              onChange={(e) =>
                setFormData({ ...formData, businessNumber: e.target.value })
              }
              helperText="사업자등록번호를 입력하세요"
            />
            <Input
              label="대표자명"
              placeholder="홍길동"
              value={formData.ceoName}
              onChange={(e) =>
                setFormData({ ...formData, ceoName: e.target.value })
              }
              helperText="대표자 이름을 입력하세요"
            />
            <div className="md:col-span-2">
              <Input
                label="주소"
                placeholder="서울시 강남구 테헤란로 123"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                helperText="거래처 주소를 입력하세요"
              />
            </div>
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
