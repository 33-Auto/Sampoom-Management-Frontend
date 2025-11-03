import { useNavigate, useParams } from "react-router-dom";

import { ReceivingProcessForm } from "@/features/receiving-process";
import { Button } from "@/shared/ui";

// 계획
// fsd 구조에 따라 데이터(entity)와 로직(feature)를 분리합니다.
// feature에는 폼에 관련된 내용을 채우기로
// entity는 데이터 처리 관련된 내용을 채우기로

export function ReceivingProcess() {
  const { warehouseId, processId } = useParams();
  if (!warehouseId || !processId) {
    throw new Error("warehouseId와 processId가 필요합니다.");
  }
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/wms/receiving");
  };

  const handleCancel = () => {
    console.log("handleCancel");
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        {/* TODO 추후에 수정하거나 공통 컴포넌트화 */}
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => navigate(-1)}
            >
              <i className="ri-arrow-left-line mr-2"></i>
              입고 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              입고 처리
            </h1>
          </div>
          <p className="text-gray-600">
            발주된 자재의 입고 처리를 수행합니다. 수량 확인, 품질 검사, 위치
            배정을 진행하세요.
          </p>
        </div>

        <ReceivingProcessForm
          warehouseId={Number(warehouseId)}
          processId={Number(processId)}
          onSucess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
