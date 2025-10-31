import { useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui";

// 계획
// fsd 구조에 따라 데이터(entity)와 로직(feature)를 분리합니다.
// feature에는 폼에 관련된 내용을 채우기로
// entity는 데이터 처리 관련된 내용을 채우기로
export function ReceivingProcess() {
  const navigate = useNavigate();

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

        {/* 발주 정보를 보여주는 칸 */}
        <div className="rounded-xl bg-bg-card-white dark:bg-bg-card-black">
          <div className="h-[400px]"></div>
        </div>
      </div>
    </div>
  );
}
