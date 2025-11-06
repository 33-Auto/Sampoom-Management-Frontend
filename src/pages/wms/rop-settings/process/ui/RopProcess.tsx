import { useLocation, useNavigate, useParams } from "react-router-dom";

import { RopProcessForm } from "@/features/rop-process";
import type { RopResDto } from "@/pages/wms/rop-settings/model";
import { Button } from "@/shared/ui";

export function RopProcess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // location state에서 ROP 데이터 받기
  const ropData = (location.state as { ropData?: RopResDto })?.ropData;

  const handleSuccess = () => {
    navigate("/wms/rop-settings");
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
              ROP 설정 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "ROP 설정 수정" : "신규 ROP 설정"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "기존 품목의 재주문점(ROP) 설정을 수정합니다."
              : "새로운 품목의 재주문점(ROP) 설정을 생성합니다."}
          </p>
        </div>

        <RopProcessForm
          ropId={isEditMode ? Number(id) : undefined}
          ropData={ropData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
