import { useLocation, useNavigate, useParams } from "react-router-dom";import { BomProcessForm, useBomDetailQuery } from "@/features/bom-process";import type { BomDetailResponseDTO, BomResponseDTO } from "@/pages/master/bom/model";import { Button } from "@/shared/ui";export function BomProcess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const bomId = id ? Number(id) : undefined;

  // location state에서 BOM 데이터 받기
  const locationState = location.state as {
    bomData?: BomResponseDTO | BomDetailResponseDTO;
  };
  const bomDataFromState = locationState?.bomData;

  // BomResponseDTO에서 categoryName, groupName 추출
  const categoryName = (bomDataFromState as BomResponseDTO)?.categoryName;
  const groupName = (bomDataFromState as BomResponseDTO)?.groupName;

  // 수정 모드일 때만 API에서 데이터 조회
  const { data: bomDataFromApi, isLoading } = useBomDetailQuery(bomId!, {
    enabled: !!bomId && !bomDataFromState,
  });

  const handleSuccess = () => {
    navigate("/master/bom");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // 수정 모드이고 API에서 데이터를 가져오는 중일 때
  if (isEditMode && !bomDataFromState && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line mb-4 animate-spin text-4xl text-gray-400"></i>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 수정 모드인데 데이터가 없을 때
  if (isEditMode && !bomDataFromState && !bomDataFromApi?.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">BOM을 찾을 수 없습니다.</p>
          <button
            onClick={async () => navigate("/master/bom")}
            className="mt-4 text-blue-600 hover:underline"
          >
            BOM 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 사용할 BOM 데이터 결정 (state에서 온 데이터 우선, 없으면 API에서 가져온 데이터)
  const bomData = bomDataFromState || bomDataFromApi?.data;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="mb-2 flex items-center space-x-3">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <i className="ri-arrow-left-line mr-2"></i>
              BOM 목록
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {isEditMode ? "BOM 수정" : "BOM 신규 등록"}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isEditMode
              ? "자재 명세서 정보를 수정합니다."
              : "새로운 자재 명세서를 생성합니다."}
          </p>
        </div>

        <BomProcessForm
          bomId={isEditMode ? bomId : undefined}
          bomData={bomData}
          categoryName={categoryName}
          groupName={groupName}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
