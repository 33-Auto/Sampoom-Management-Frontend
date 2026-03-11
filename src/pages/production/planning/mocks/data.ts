import type { ProductionPlanResponseDTO } from "../model";

export type ProductionPlanRecord = ProductionPlanResponseDTO;

export const mockProductionPlans: ProductionPlanRecord[] = [
  ...Array.from({ length: 800 }).map((_, i) => {
    // 서울 1공장(101)에 데이터가 집중되도록 조정 (i가 400 미만일 때 101 고정)
    const factoryId = i < 400 ? 101 : 101 + (i % 4);
    const factoryName = [
      "서울 1공장",
      "광주 2공장",
      "울산 3공장",
      "안산 4공장",
    ][(factoryId - 101) % 4];

    // 기본 필터인 UNDER_REVIEW 상태가 많이 나오도록 조정
    const status =
      i < 300
        ? "UNDER_REVIEW"
        : [
            "UNDER_REVIEW",
            "PLAN_CONFIRMED",
            "IN_PROGRESS",
            "COMPLETED",
            "DELAYED",
            "CANCELED",
          ][i % 6];

    return {
      orderId: 9001 + i,
      orderCode: `WO-2025-${(10000 + i).toString().slice(1)}`,
      factoryId,
      factoryName,
      warehouseName: [
        "인천 물류센터",
        "대구 물류센터",
        "부산 항만 창고",
        "경기 물류센터",
      ][i % 4],
      status: status as any,
      priority: ["HIGH", "MEDIUM", "LOW"][i % 3] as any,
      orderDate: `2024-12-${(1 + (i % 28)).toString().padStart(2, "0")}T09:00:00+09:00`,
      requiredDate: `2025-01-${(1 + (i % 28)).toString().padStart(2, "0")}T10:00:00+09:00`,
      scheduledDate: `2025-01-${(1 + (i % 28)).toString().padStart(2, "0")}T09:00:00+09:00`,
      minimumStartDate: `2025-01-${(1 + (i % 28)).toString().padStart(2, "0")}T09:00:00+09:00`,
      progressRate: status === "COMPLETED" ? 1.0 : (i * 0.07) % 1.0,
      dday: 5 + (i % 20) - 10,
      materialAvailability: ["SUFFICIENT", "INSUFFICIENT", "PENDING"][
        i % 3
      ] as any,
      items: [
        {
          partId: 1001 + i,
          partCode: `PART-MRP-${1000 + i}`,
          partName: `고정밀 제어 모듈 Type-${i} (생산 계획 및 자재 수급 최적화를 위한 복합 구성 부품 데이터 - 성능 테스트용 롱 텍스트 데이터 포함)`,
          partGroup: String(10 + (i % 10)),
          partCategory: String((i % 5) + 1),
          partGroupName: [
            "연료 공급",
            "엔진 블록",
            "현가 장치",
            "제동 장치",
            "센서 모듈",
            "제어 모듈",
            "라디에이터",
            "배기 매니폴드",
            "배터리 시스템",
            "공조 장치",
          ][i % 10],
          partCategoryName: [
            "엔진 부품",
            "섀시 부품",
            "전자 부품",
            "냉각 시스템",
            "배기 시스템",
          ][i % 5],
          quantity: 10 + ((i * 5) % 100),
        },
      ],
    };
  }),
];
