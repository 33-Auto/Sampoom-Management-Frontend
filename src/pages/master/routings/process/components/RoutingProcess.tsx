import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { ProcessResponseDTO } from "@/entities/routing";
import { RoutingProcessForm } from "@/features/routing-process";
import { Button } from "@/shared/ui";

export function RoutingProcess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // location state에서 routing 데이터 받기
  const routingData = (
    location.state as {
      routingData?: ProcessResponseDTO;
    }
  )?.routingData;

  const handleSuccess = () => {
    navigate("/master/routings");
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
              공정 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "공정 수정" : "신규 공정 등록"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "기존 공정 정보를 수정합니다."
              : "새로운 공정 정보를 입력하여 등록합니다."}
          </p>
        </div>

        <RoutingProcessForm
          routingId={isEditMode ? Number(id) : undefined}
          routingData={routingData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
