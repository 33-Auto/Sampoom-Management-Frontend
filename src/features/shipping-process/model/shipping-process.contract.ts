import { z } from "zod";

export const ShippingProcessItemSchema = z
  .object({
    partId: z.number(),
    partName: z.string().min(1, { message: "품목명이 필요합니다." }),
    partCode: z.string().min(1, { message: "품목 코드가 필요합니다." }),
    orderQuantity: z.number().nonnegative(),
    availableStock: z.number().nonnegative(),
    delta: z
      .number()
      .int({ message: "출고 수량은 정수여야 합니다." })
      .min(0, { message: "출고 수량은 0 이상이어야 합니다." }),
  })
  .superRefine((item, ctx) => {
    if (!Number.isFinite(item.partId) || item.partId <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "유효한 품목 ID가 필요합니다.",
        path: ["partId"],
      });
    }

    if (!Number.isFinite(item.orderQuantity)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "발주 수량 정보가 필요합니다.",
        path: ["orderQuantity"],
      });
    }

    if (!Number.isFinite(item.availableStock)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "가용 재고 정보가 필요합니다.",
        path: ["availableStock"],
      });
    }

    if (item.delta > item.orderQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `출고 수량은 발주 수량(${item.orderQuantity})을 초과할 수 없습니다.`,
        path: ["delta"],
      });
    }

    if (item.delta > item.availableStock) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `출고 수량은 가용 재고(${item.availableStock})을 초과할 수 없습니다.`,
        path: ["delta"],
      });
    }
  });

export const ShippingProcessSchema = z
  .object({
    items: z.array(ShippingProcessItemSchema).min(1, {
      message: "출고할 품목이 필요합니다.",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.items.some((item) => item.delta > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "최소 한 개 이상의 품목은 출고 수량이 0보다 커야 합니다.",
        path: ["items"],
      });
    }
  });

export type ShippingProcessFormData = z.infer<typeof ShippingProcessSchema>;
export type ShippingProcessFormInput = z.input<typeof ShippingProcessSchema>;
