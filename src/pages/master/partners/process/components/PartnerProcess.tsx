import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { PartnerResponseDTO } from "@/entities/partner";
import { PartnerProcessForm } from "@/features/partner-process";
import { Button } from "@/shared/ui";

export function PartnerProcess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // location state에서 partner 데이터 받기
  const partnerData = (
    location.state as {
      partnerData?: PartnerResponseDTO;
    }
  )?.partnerData;

  const handleSuccess = () => {
    navigate("/master/partners");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <i className="ri-arrow-left-line mr-2"></i>
              거래처 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "거래처 수정" : "신규 거래처 등록"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "기존 거래처 정보를 수정합니다."
              : "새로운 거래처 정보를 입력하여 등록합니다."}
          </p>
        </div>

        <PartnerProcessForm
          partnerId={isEditMode ? Number(id) : undefined}
          partnerData={partnerData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
