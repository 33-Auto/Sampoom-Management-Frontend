import { useLocation, useNavigate, useParams } from "react-router-dom";import { WorkCenterProcessForm } from "@/features/workcenter-process";import type { WorkCenterResponseDTO } from "@/pages/master/workcenters/model";import { Button } from "@/shared/ui";export function WorkCenterProcess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // location state에서 workcenter 데이터 받기
  const workCenterData = (
    location.state as {
      workCenterData?: WorkCenterResponseDTO;
    }
  )?.workCenterData;

  const handleSuccess = () => {
    navigate("/master/workcenters");
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
              작업장 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "작업장 수정" : "신규 작업장 등록"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "기존 작업장 정보를 수정합니다."
              : "새로운 작업장 정보를 입력하여 등록합니다."}
          </p>
        </div>

        <WorkCenterProcessForm
          workCenterId={isEditMode ? Number(id) : undefined}
          workCenterData={workCenterData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
