import { useEffect, useMemo } from "react";import { useForm } from "react-hook-form";import { cn, formatCurrency, formatNumber, useNotification } from "@/shared/lib";import { Button, Card, InfoBox, Input } from "@/shared/ui";import { useStockingMutation } from "../api";import { createStockingProcessSchema, type StockingProcessFormData, type StockingProcessFormProps, type StockingProcessResponse } from "../model";interface OrderInfoProps {
  label: string;
  value?: string;
  fixed?: boolean;
}

const OrderInfo = ({ label, value, fixed = false }: OrderInfoProps) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>
    <span
      className={cn(
        "block rounded border border-gray-200 px-3 py-2 font-mono text-sm dark:border-gray-700",
        fixed && "bg-gray-100 dark:bg-gray-800",
      )}
    >
      {value ?? "-"}
    </span>
  </div>
);

const getMaxQuantity = (detail?: StockingProcessResponse) =>
  detail?.restQuantity ? Math.max(0, detail.restQuantity) : 0;

export function StockingProcessForm({
  purchaseOrderId,
  warehouseId,
  detail,
  onSuccess,
  onCancel,
}: StockingProcessFormProps) {
  const maxQuantity = useMemo(() => getMaxQuantity(detail), [detail]);

  const safeMaxQuantity = useMemo(
    () => Math.max(1, maxQuantity),
    [maxQuantity],
  );

  const schema = useMemo(
    () => createStockingProcessSchema(safeMaxQuantity),
    [safeMaxQuantity],
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<StockingProcessFormData>({
    mode: "onChange",
    defaultValues: {
      stockingQuantity: maxQuantity > 0 ? maxQuantity : 1,
    },
  });

  useEffect(() => {
    if (!detail) return;
    reset({
      stockingQuantity:
        detail.restQuantity && detail.restQuantity > 0
          ? detail.restQuantity
          : 1,
    });
  }, [detail, reset]);

  const { showSuccess, showError } = useNotification();
  const { mutateAsync, isPending } = useStockingMutation();

  const handleSubmitForm = async (formData: StockingProcessFormData) => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setError("stockingQuantity", {
        type: "manual",
        message: firstError.message,
      });
      return;
    }

    if (!detail?.partId) {
      showError("입고 처리 실패", "품목 정보가 누락되었습니다.");
      return;
    }
    try {
      await mutateAsync({
        body: {
          purchaseOrderId,
          warehouseId,
          items: [
            {
              id: detail.partId,
              delta: formData.stockingQuantity,
            },
          ],
        },
      });
      showSuccess("입고 처리 완료", "발주의 입고 처리가 완료되었습니다.");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showError("입고 처리 실패", "입고 처리 중 오류가 발생했습니다.");
    }
  };

  if (!detail) {
    throw new Error("입고 처리 정보가 필요합니다.");
  }

  const {
    orderNumber,
    partCode,
    partName,
    categoryName,
    groupName,
    orderQuantity,
    inboundQuantity,
    restQuantity,
    price,
    scheduledDate,
    receivedDate,
  } = detail;

  const canSubmit = maxQuantity > 0;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          발주 정보
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <OrderInfo label="발주 번호" value={orderNumber ?? "-"} fixed />
          <OrderInfo label="품목 코드" value={partCode ?? "-"} fixed />
          <OrderInfo label="품목명" value={partName ?? "-"} />
          <OrderInfo
            label="카테고리"
            value={`${categoryName ?? "-"} > ${groupName ?? "-"}`}
          />
          <OrderInfo
            label="예정일"
            value={
              scheduledDate
                ? new Date(scheduledDate).toLocaleDateString("ko-KR")
                : "-"
            }
          />
          <OrderInfo
            label="최근 입고일"
            value={
              receivedDate
                ? new Date(receivedDate).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"
            }
          />
        </div>

        <div className="mt-6 mb-6 border-t border-gray-200 pt-6 dark:border-gray-700" />
        <h3 className="text-md mb-3 font-semibold text-gray-900 dark:text-gray-100">
          수량 현황
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <InfoBox title="발주 수량" type="info">
            <div className="text-2xl font-semibold">
              {formatNumber(orderQuantity ?? 0)}
            </div>
          </InfoBox>
          <InfoBox title="기입고 수량" type="success">
            <div className="text-2xl font-semibold">
              {formatNumber(inboundQuantity ?? 0)}
            </div>
          </InfoBox>
          <InfoBox title="미입고 수량" type="warning">
            <div className="text-2xl font-semibold">
              {formatNumber(restQuantity ?? 0)}
            </div>
          </InfoBox>
          <InfoBox title="발주 금액" type="info">
            <div className="text-2xl font-semibold">
              {formatCurrency(price ?? 0)}
            </div>
          </InfoBox>
        </div>
      </Card>

      <Card className="p-6">
        <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="발주 수량"
              type="number"
              value={orderQuantity ?? 0}
              disabled
            />
            <Input
              label="입고 수량"
              type="number"
              min={1}
              max={maxQuantity}
              helperText={`최대 ${formatNumber(maxQuantity)}개까지 입고 가능합니다.`}
              {...register("stockingQuantity", {
                required: "입고 수량을 입력하세요.",
                valueAsNumber: true,
                validate: (value) => {
                  if (Number.isNaN(value)) {
                    return "입고 수량을 입력하세요.";
                  }
                  if (!Number.isInteger(value)) {
                    return "수량은 정수여야 합니다.";
                  }
                  if (maxQuantity <= 0) {
                    return "입고 가능한 수량이 없습니다.";
                  }
                  if (value < 1) {
                    return "입고 수량은 1개 이상이어야 합니다.";
                  }
                  if (value > maxQuantity) {
                    return `최대 ${formatNumber(maxQuantity)}개까지 입고 가능합니다.`;
                  }
                  clearErrors("stockingQuantity");
                  return true;
                },
              })}
              errorText={errors.stockingQuantity?.message}
              disabled={!canSubmit}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={onCancel}>
              취소
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={!isValid || !canSubmit || isPending}
              loading={isPending}
            >
              입고 처리
            </Button>
          </div>

          {!canSubmit && (
            <p className="text-sm text-gray-500 dark:text-gray-300">
              미입고 수량이 없어 더 이상 입고 처리를 진행할 수 없습니다.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
