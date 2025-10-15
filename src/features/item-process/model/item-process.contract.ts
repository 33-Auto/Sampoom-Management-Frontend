import { z } from "zod";const toOptionalNumber = (value: unknown) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const toRequiredNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

export const ItemProcessSchema = z
  .object({
    type: z.enum(["MATERIAL", "PART"]),
    name: z.string().trim().min(1, { message: "품목명을 입력해주세요." }),
    materialCategoryId: z
      .preprocess(
        toOptionalNumber,
        z.number().min(1, { message: "자재 카테고리를 선택해주세요." }),
      )
      .optional(),
    materialUnit: z.string().optional(),
    partCategoryId: z
      .preprocess(
        toOptionalNumber,
        z.number().min(1, { message: "부품 카테고리를 선택해주세요." }),
      )
      .optional(),
    groupId: z
      .preprocess(
        toOptionalNumber,
        z.number().min(1, { message: "부품 그룹을 선택해주세요." }),
      )
      .optional(),
    partUnit: z.string().optional(),
    baseQuantity: z.preprocess(
      toRequiredNumber,
      z.number().min(0, { message: "안전 재고는 0 이상이어야 합니다." }),
    ),
    standardQuantity: z.preprocess(
      toRequiredNumber,
      z.number().min(0, { message: "기준 수량은 0 이상이어야 합니다." }),
    ),
    leadTime: z
      .preprocess(
        toOptionalNumber,
        z.number().min(0, { message: "리드 타임은 0 이상이어야 합니다." }),
      )
      .optional(),
    standardCost: z
      .preprocess(
        toOptionalNumber,
        z.number().min(0, { message: "표준 단가는 0 이상이어야 합니다." }),
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "MATERIAL") {
      if (data.materialCategoryId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["materialCategoryId"],
          message: "자재 카테고리를 선택해주세요.",
        });
      }
      if (!data.materialUnit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["materialUnit"],
          message: "기본 단위를 선택해주세요.",
        });
      }
      if (data.leadTime === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leadTime"],
          message: "리드 타임을 입력해주세요.",
        });
      }
      if (data.standardCost === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["standardCost"],
          message: "표준 단가를 입력해주세요.",
        });
      }
    }

    if (data.type === "PART") {
      if (data.partCategoryId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["partCategoryId"],
          message: "부품 카테고리를 선택해주세요.",
        });
      }
      if (data.groupId === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["groupId"],
          message: "부품 그룹을 선택해주세요.",
        });
      }
      if (!data.partUnit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["partUnit"],
          message: "기본 단위를 선택해주세요.",
        });
      }
    }
  });

export type ItemProcessFormData = z.infer<typeof ItemProcessSchema>;
