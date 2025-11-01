import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { cn } from "@/shared/lib";
import { Button, Card, InfoBox, Input, Textarea } from "@/shared/ui";

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
          isFixed && "bg-gray-100 dark:bg-gray-800",
        )}
      >
        {info}
      </span>
    </div>
  );
};

export function ReceivingProcess() {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
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

        {/* 발주 정보를 보여주는 카드 */}
        <Card className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            발주 정보
          </h2>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <OrderInfo label="발주 번호" info="PO-2024-001" isFixed={true} />
            <OrderInfo label="예정일" info="2024-01-15" />
            <OrderInfo label="품목코드" info="RM-AL-001" isFixed={true} />
            <OrderInfo label="품목명" info="알루미늄 합금" />
          </div>

          {/* 구분선 */}
          <div className="mb-6 border-t border-gray-200 pt-6 dark:border-gray-700" />

          {/* 수량 정보 */}
          <h3 className="text-md mb-3 font-semibold text-gray-900 dark:text-white">
            수량 현황
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoBox title="발주 수량" type="info">
              <div>
                <div>
                  <span className="text-2xl font-bold">500</span>
                </div>
              </div>
            </InfoBox>
            <InfoBox title="기입고 수량" type="success">
              <div>
                <div>
                  <span className="text-2xl font-bold">300</span>
                </div>
              </div>
            </InfoBox>
            <InfoBox title="미입고 수량" type="warning">
              <div>
                <div>
                  <span className="text-2xl font-bold">200</span>
                </div>
              </div>
            </InfoBox>
          </div>
        </Card>

        {/* 입고 처리 폼 */}
        <Card>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                입고 정보
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="발주 수량" type="number" disabled value={500} />
                <Input
                  label="기입고 수량"
                  type="number"
                  value={300}
                  helperText={"최대 500개까지 입고 가능"}
                  {...register("orderQuantity")}
                />

                <Input
                  label="입고 날짜"
                  type="date"
                  {...register("receivingDate")}
                />
                <Input
                  label="입고 시간"
                  type="time"
                  {...register("receivingTime")}
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                추가 정보
              </h2>
              <Textarea
                label="특이사항 및 메모"
                placeholder="입고 과정에서 발견된 특이사항이나 추가 메모를 입력하세요"
                {...register("note")}
              />
            </div>

            <div className="flex justify-end">
              <Button variant="secondary">취소</Button>
              <Button variant="default">입고 처리</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
