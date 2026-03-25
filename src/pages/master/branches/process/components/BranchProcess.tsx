import { useLocation, useNavigate, useParams } from "react-router-dom";

import type { BranchResponseDTO } from "@/entities/branch";
import { BranchProcessForm } from "@/features/branch-process";
import { Button } from "@/shared/ui";

export function BranchProcess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // location state에서 branch 데이터 받기
  const branchData = (
    location.state as {
      branchData?: BranchResponseDTO;
    }
  )?.branchData;

  const handleSuccess = () => {
    navigate("/master/branches");
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
              지점 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "지점 수정" : "신규 지점 등록"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "기존 지점 정보를 수정합니다."
              : "새로운 지점 정보를 입력하여 등록합니다."}
          </p>
        </div>

        <BranchProcessForm
          branchId={isEditMode ? Number(id) : undefined}
          branchData={branchData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
