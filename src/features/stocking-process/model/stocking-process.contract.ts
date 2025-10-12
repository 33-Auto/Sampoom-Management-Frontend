import { z } from "zod";const stockingProcessBaseSchema = z.object({
  stockingQuantity: z.coerce
    .number()
    .int({ message: "수량은 정수여야 합니다." })
    .min(1, { message: "입고 수량은 1개 이상이어야 합니다." }),
});

export const createStockingProcessSchema = (maxQuantity: number) =>
  stockingProcessBaseSchema.superRefine((data, ctx) => {
    if (data.stockingQuantity > maxQuantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `최대 ${maxQuantity}개까지 입고할 수 있습니다.`,
        path: ["stockingQuantity"],
      });
    }
  });

export type StockingProcessFormData = z.infer<typeof stockingProcessBaseSchema>;
