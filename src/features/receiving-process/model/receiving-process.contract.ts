import { z } from "zod";// Form의 제약 사항을 정의 하기
export const ReceivingProcessSchema = z.object({
  receivingQuantity: z.coerce
    .number()
    .min(1, { message: "수량은 1개 이상이어야 합니다." }),
  receivingDate: z.string().min(1, { message: "입고 날짜를 선택해주세요." }),
  receivingTime: z.string().min(1, { message: "입고 시간을 선택해주세요." }),
  note: z.string().optional(),
});

export type ReceivingProcessFormData = z.infer<typeof ReceivingProcessSchema>;
