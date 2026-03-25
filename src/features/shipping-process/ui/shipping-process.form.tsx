import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { useNotification, formatNumber } from "@/shared/lib";
import { Button, Card, Input, Table } from "@/shared/ui";

import { useShippingProcessMutation } from "../api";
import {
  ShippingProcessSchema,
  type ShippingProcessFormData,
  type ShippingProcessFormInput,
  toShippingProcessItems,
  type ShippingProcessFormProps,
} from "../model";

export function ShippingProcessForm({
  warehouseId,
  orderId,
  order,
  onSuccess,
  onCancel,
}: ShippingProcessFormProps) {
  const defaultItems = useMemo(
    () => toShippingProcessItems(order.items),
    [order.items],
  );

  if (defaultItems.length === 0) {
    throw new Error("출고 처리 대상 품목이 필요합니다.");
  }

  const formMethods = useForm<
    ShippingProcessFormData,
    undefined,
    ShippingProcessFormInput
  >({
    mode: "onChange",
    resolver: zodResolver(ShippingProcessSchema),
    defaultValues: {
      items: defaultItems,
    },
  });

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isValid },
  } = formMethods;

  useEffect(() => {
    reset({ items: defaultItems });
  }, [defaultItems, reset]);

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  const tableData = useMemo(
    () =>
      fields.map((field, index) => ({
        id: field.id,
        partName: field.partName,
        partCode: field.partCode ?? "-",
        orderQuantityLabel: `${formatNumber(field.orderQuantity ?? 0)} EA`,
        availableStockLabel: `${formatNumber(field.availableStock ?? 0)} EA`,
        orderQuantity: field.orderQuantity ?? 0,
        availableStock: field.availableStock ?? 0,
        __index: index,
      })),
    [fields],
  );

  const { showError, showSuccess } = useNotification();
  const { mutateAsync, isPending } = useShippingProcessMutation();

  const handleSubmitForm = async (formData: ShippingProcessFormData) => {
    try {
      await mutateAsync({
        body: {
          warehouseId,
          orderId,
          items: formData.items
            .filter((item) => item.delta > 0)
            .map((item) => ({
              id: item.partId,
              delta: -Math.abs(item.delta),
            })),
        },
      });

      showSuccess(
        "출고 처리 완료",
        "선택한 품목의 출고 처리가 완료되었습니다.",
      );
      onSuccess?.();
    } catch (error) {
      console.error(error);
      showError("출고 처리 실패", "출고 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            출고 처리
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            주문 번호 {order.orderNumber ?? "-"} / 대리점{" "}
            {order.agencyName ?? "-"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(handleSubmitForm)}>
          <Table
            columns={[
              {
                key: "partName",
                title: "품목",
              },
              {
                key: "partCode",
                title: "품목 코드",
              },
              {
                key: "orderQuantityLabel",
                title: "요청 수량",
              },
              {
                key: "availableStockLabel",
                title: "가용 재고",
              },
              {
                key: "delta",
                title: "출고 수량",
                render: (_value: number, record) => {
                  const index = record.__index as number;
                  const currentItem = watchedItems?.[index];
                  const itemErrors = errors.items?.[index];
                  const maxQuantity = Math.min(
                    record.orderQuantity ?? 0,
                    record.availableStock ?? 0,
                  );

                  return (
                    <div className="inline-flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={maxQuantity}
                          {...register(`items.${index}.delta`, {
                            valueAsNumber: true,
                          })}
                          helperText={`최대 ${formatNumber(maxQuantity)} EA`}
                          errorText={itemErrors?.delta?.message}
                        />

                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            formMethods.setValue(
                              `items.${index}.delta`,
                              Math.max(0, maxQuantity),
                              { shouldValidate: true, shouldTouch: true },
                            )
                          }
                        >
                          최대
                        </Button>
                      </div>
                      {currentItem?.availableStock === 0 && (
                        <p className="text-warning-dark text-xs">
                          가용 재고가 없습니다.
                        </p>
                      )}
                    </div>
                  );
                },
              },
            ]}
            data={tableData}
          />

          {typeof errors.items?.message === "string" && (
            <p className="text-sm text-error-red">{errors.items.message}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onCancel}>
              취소
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={!isValid || isPending}
              loading={isPending}
            >
              출고 처리
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
