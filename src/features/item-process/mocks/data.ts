export type MockMaterialDetail = {
  materialId: number;
  name: string;
  materialCategoryId: number;
  materialUnit: string;
  baseQuantity: number;
  standardQuantity: number;
  leadTime: number;
  standardCost: number;
};

export type MockPartDetail = {
  partId: number;
  name: string;
  categoryId: number;
  groupId: number;
  partUnit: string;
  baseQuantity: number;
  standardQuantity: number;
  leadTime: number;
};

export const mockMaterialDetails: MockMaterialDetail[] = [
  {
    materialId: 801,
    name: "고강도 알루미늄 합금",
    materialCategoryId: 302,
    materialUnit: "KG",
    baseQuantity: 1000,
    standardQuantity: 1200,
    leadTime: 14,
    standardCost: 18500,
  },
  {
    materialId: 802,
    name: "고무 시일링 원자재",
    materialCategoryId: 303,
    materialUnit: "KG",
    baseQuantity: 500,
    standardQuantity: 650,
    leadTime: 10,
    standardCost: 4500,
  },
  {
    materialId: 803,
    name: "스테인리스 스틸 봉재",
    materialCategoryId: 301,
    materialUnit: "KG",
    baseQuantity: 800,
    standardQuantity: 1000,
    leadTime: 12,
    standardCost: 12500,
  },
  {
    materialId: 804,
    name: "엔지니어링 플라스틱 펠릿",
    materialCategoryId: 303,
    materialUnit: "KG",
    baseQuantity: 600,
    standardQuantity: 750,
    leadTime: 8,
    standardCost: 7200,
  },
  {
    materialId: 805,
    name: "PCB 기판",
    materialCategoryId: 304,
    materialUnit: "EA",
    baseQuantity: 200,
    standardQuantity: 250,
    leadTime: 18,
    standardCost: 24500,
  },
  {
    materialId: 806,
    name: "구리 전선",
    materialCategoryId: 305,
    materialUnit: "KG",
    baseQuantity: 400,
    standardQuantity: 500,
    leadTime: 7,
    standardCost: 9800,
  },
  {
    materialId: 807,
    name: "세라믹 소재",
    materialCategoryId: 306,
    materialUnit: "KG",
    baseQuantity: 300,
    standardQuantity: 380,
    leadTime: 15,
    standardCost: 15200,
  },
];

export const mockPartDetails: MockPartDetail[] = [
  {
    partId: 1001,
    name: "고압 연료 펌프",
    categoryId: 1,
    groupId: 11,
    partUnit: "EA",
    baseQuantity: 120,
    standardQuantity: 150,
    leadTime: 21,
  },
  {
    partId: 2002,
    name: "세라믹 브레이크 패드",
    categoryId: 2,
    groupId: 22,
    partUnit: "SET",
    baseQuantity: 80,
    standardQuantity: 100,
    leadTime: 14,
  },
  {
    partId: 1002,
    name: "알루미늄 엔진 블록",
    categoryId: 1,
    groupId: 12,
    partUnit: "EA",
    baseQuantity: 40,
    standardQuantity: 50,
    leadTime: 25,
  },
  {
    partId: 2001,
    name: "후륜 서스펜션 스프링",
    categoryId: 2,
    groupId: 21,
    partUnit: "EA",
    baseQuantity: 200,
    standardQuantity: 250,
    leadTime: 10,
  },
  {
    partId: 3001,
    name: "ABS 휠 속도 센서",
    categoryId: 3,
    groupId: 31,
    partUnit: "EA",
    baseQuantity: 180,
    standardQuantity: 220,
    leadTime: 9,
  },
  {
    partId: 1003,
    name: "연료 인젝터",
    categoryId: 1,
    groupId: 11,
    partUnit: "EA",
    baseQuantity: 150,
    standardQuantity: 180,
    leadTime: 8,
  },
  {
    partId: 2003,
    name: "전륜 서스펜션 스프링",
    categoryId: 2,
    groupId: 21,
    partUnit: "EA",
    baseQuantity: 180,
    standardQuantity: 220,
    leadTime: 9,
  },
  {
    partId: 3002,
    name: "배기가스 온도 센서",
    categoryId: 3,
    groupId: 31,
    partUnit: "EA",
    baseQuantity: 110,
    standardQuantity: 140,
    leadTime: 12,
  },
];
