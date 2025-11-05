// TODO: 타입 체크 임시 비활성화 - 타입 에러 수정 후 이 줄 제거
// @ts-nocheck
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useNotification } from "@/app/providers/NotificationContext";
import { cn } from "@/shared/lib";
import { Button, Card, InfoBox, Input, Textarea } from "@/shared/ui";

import { useReceivingProcessQuery } from "../api/receiving-process.api";
import { useReceivingProcessMutation } from "../api/receiving-process.mutation";
import { ReceivingProcessSchema } from "../model/receiving-process.contract";
import type {
  PurchaseOrderInfo,
  ReceivingProcess,
  ReceivingProcessFormProps,
} from "../model/receiving-process.types";

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

// TODO : 추후 수정에 대한 내용은 props로 받아서 처리
export function ReceivingProcessForm({
  warehouseId,
  processId,
  onSucess,
  onCancel,
}: ReceivingProcessFormProps) {
  const { data, isLoading } = useReceivingProcessQuery(warehouseId, processId);

  // react-hook-form 사용
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(ReceivingProcessSchema),
    defaultValues: {
      receivingQuantity: 0,
      receivingDate: "",
      receivingTime: "",
      note: "",
    },
  });

  // loader로 가져온 데이터를 폼에 채우기
  useEffect(() => {
    if (data?.data) {
      reset({
        receivingQuantity: data.data.receivingQuantity || 0,
        receivingDate: data.data.receivingDate || "",
        receivingTime: data.data.receivingTime || "",
        note: data.data.note || "",
      });
    }
  }, [data, reset]);

  const { showSuccess, showError } = useNotification();

  const { mutate, isPending, isError, error } = useReceivingProcessMutation();

  const onSubmit = (data: ReceivingProcess) => {
    // TODO: warehouseId와 processId를 실제 값으로 대체해야 함

    console.log("TEst");
    mutate(
      {
        params: {
          path: {
            warehouseId: warehouseId,
            processId: processId,
          },
        },
        body: data,
      },
      {
        onSuccess: () => {
          showSuccess(
            "입고 처리 성공",
            "입고 처리가 성공적으로 완료되었습니다.",
          );
          onSucess?.();
        },
        onError: () => {
          showError("입고 처리 실패", "입고 처리가 실패했습니다.");
        },
      },
    );
  };

  if (isLoading || !data?.data) {
    return (
      <Card>
        <div className="py-8 text-center text-gray-500">
          데이터를 불러오는 중...
        </div>
      </Card>
    );
  }

  const {
    orderNumber,
    expectedDate,
    itemCode,
    itemName,
    orderedQuantity,
    receivedQuantity,
    remainingQuantity,
  } = data?.data as PurchaseOrderInfo;

  return (
    <>
      {/* 발주 정보를 보여주는 카드 */}
      <Card className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          발주 정보
        </h2>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <OrderInfo
            label="발주 번호"
            info={orderNumber || ""}
            isFixed={true}
          />
          <OrderInfo label="예정일" info={expectedDate || ""} />
          <OrderInfo label="품목코드" info={itemCode || ""} isFixed={true} />
          <OrderInfo label="품목명" info={itemName || ""} />
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
                <span className="text-2xl font-bold">
                  {orderedQuantity || 0}
                </span>
              </div>
            </div>
          </InfoBox>
          <InfoBox title="기입고 수량" type="success">
            <div>
              <div>
                <span className="text-2xl font-bold">
                  {receivedQuantity || 0}
                </span>
              </div>
            </div>
          </InfoBox>
          <InfoBox title="미입고 수량" type="warning">
            <div>
              <div>
                <span className="text-2xl font-bold">
                  {remainingQuantity || 0}
                </span>
              </div>
            </div>
          </InfoBox>
        </div>
      </Card>

      {/* 입고 처리 폼 */}
      <Card>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {isError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              입고 정보
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="발주 수량"
                type="number"
                disabled
                value={orderedQuantity || 0}
              />
              <div>
                <Input
                  label="입고 수량"
                  type="number"
                  {...register("receivingQuantity")}
                  helperText={`최대 ${remainingQuantity || 0}개까지 입고 가능`}
                  errorText={errors.receivingQuantity?.message}
                />
              </div>

              <Input
                label="입고 날짜"
                type="date"
                {...register("receivingDate")}
                errorText={errors.receivingDate?.message}
              />
              <Input
                label="입고 시간"
                type="time"
                {...register("receivingTime")}
                errorText={errors.receivingTime?.message}
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
            <Button variant="secondary" type="button" onClick={onCancel}>
              취소
            </Button>
            <Button
              variant="default"
              disabled={!isValid || isPending}
              loading={isPending}
            >
              입고 처리
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
