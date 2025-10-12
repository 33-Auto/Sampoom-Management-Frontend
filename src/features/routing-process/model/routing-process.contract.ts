import { z } from "zod";// NaN을 0으로 변환하는 preprocess 함수
const nanToZero = (val: unknown): number => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

// 공정 스텝 스키마
const ProcessStepSchema = z.object({
  stepOrder: z.preprocess(
    nanToZero,
    z.number().min(1, { message: "공정 순서는 1 이상이어야 합니다." }),
  ),
  stepName: z.string().min(1, { message: "공정명을 입력해주세요." }),
  workCenterId: z.preprocess(
    nanToZero,
    z.number().min(1, { message: "작업장을 선택해주세요." }),
  ),
  setupMinutes: z.preprocess(
    nanToZero,
    z.number().min(0, { message: "준비시간은 0 이상이어야 합니다." }),
  ),
  processMinutes: z.preprocess(
    nanToZero,
    z.number().min(0, { message: "가공시간은 0 이상이어야 합니다." }),
  ),
  waitMinutes: z.preprocess(
    nanToZero,
    z.number().min(0, { message: "대기시간은 0 이상이어야 합니다." }),
  ),
});

// 공정 폼 스키마
export const RoutingProcessSchema = z.object({
  partId: z.preprocess(
    nanToZero,
    z.number().min(1, { message: "품목을 선택해주세요." }),
  ),
  version: z.string().min(1, { message: "버전을 입력해주세요." }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  quantity: z.preprocess(
    nanToZero,
    z.number().min(1, { message: "수량은 1 이상이어야 합니다." }),
  ),
  steps: z
    .array(ProcessStepSchema)
    .min(1, { message: "최소 1개 이상의 공정이 필요합니다." }),
});

export type RoutingProcessFormData = z.infer<typeof RoutingProcessSchema>;
export type ProcessStepFormData = z.infer<typeof ProcessStepSchema>;
