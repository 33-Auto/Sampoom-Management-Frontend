import { useNavigate } from "react-router-dom";

import { cn } from "@/shared/lib";
import { Button, Card, InfoBox } from "@/shared/ui";

// 계획
// fsd 구조에 따라 데이터(entity)와 로직(feature)를 분리합니다.
// feature에는 폼에 관련된 내용을 채우기로
// entity는 데이터 처리 관련된 내용을 채우기로
interface OrderInfoProps {
  label: string;
  info: string;
  isFixed?: boolean;
}

const OrderInfo = ({ label, info, isFixed = false }: OrderInfoProps) => {
  return (
    <div>
      <label className="text-gray-799 mb-1 block text-sm font-medium dark:text-white">
        {label}
      </label>
      <span
        className={cn(
          "block rounded px-3 py-2 font-mono text-sm",
          isFixed && "bg-gray-100",
        )}
      >
        {info}
      </span>
    </div>
  );
};

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

        {/* 발주 정보를 보여주는 카드 */}
        <Card className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            발주 정보
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <OrderInfo label="발주 번호" info="PO-2024-001" isFixed={true} />
            <OrderInfo label="예정일" info="2024-01-15" />
            <div />
            <OrderInfo label="품목코드" info="RM-AL-001" isFixed={true} />
            <OrderInfo label="품목명" info="알루미늄 합금" />
            <OrderInfo label="단가" info={`₩ ${(10000).toLocaleString()}`} />
          </div>

          {/* 구분선 */}
          <div className="mb-6 border-t border-gray-200 pt-6" />

          {/* 수량 정보 */}
          <h3 className="text-md mb-3 font-semibold text-gray-900">
            수량 현황
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoBox title="발주 수량" type="info">
              <div>
                <div>
                  <span className="text-2xl font-bold">100</span>
                </div>
              </div>
            </InfoBox>
            <InfoBox title="기입고 수량" type="success">
              <div>
                <div>
                  <span className="text-2xl font-bold">100</span>
                </div>
              </div>
            </InfoBox>
            <InfoBox title="미입고 수량" type="warning">
              <div>
                <div>
                  <span className="text-2xl font-bold">100</span>
                </div>
              </div>
            </InfoBox>
          </div>
        </Card>

        {/* 입고 처리 폼 */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            발주 정보
          </h2>
        </Card>
      </div>
    </div>
  );
}
