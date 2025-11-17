export type MaterialCategory = {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
};

export const mockMaterialCategories: MaterialCategory[] = [
  {
    id: 301,
    code: "MAT-CAT-STEEL",
    name: "철강",
    description: "열연/냉연 강판 및 단조 소재",
    status: "ACTIVE",
  },
  {
    id: 302,
    code: "MAT-CAT-AL",
    name: "알루미늄",
    description: "주조 및 압출 알루미늄 소재",
    status: "ACTIVE",
  },
  {
    id: 303,
    code: "MAT-CAT-PLS",
    name: "플라스틱/고무",
    description: "엔지니어링 플라스틱, 실리콘, 고무류",
    status: "ACTIVE",
  },
  {
    id: 304,
    code: "MAT-CAT-ELEC",
    name: "전자 소재",
    description: "PCB, 반도체 패키지용 소재",
    status: "INACTIVE",
  },
  {
    id: 305,
    code: "MAT-CAT-COPPER",
    name: "구리/동",
    description: "전선, 케이블용 구리 소재",
    status: "ACTIVE",
  },
  {
    id: 306,
    code: "MAT-CAT-GLASS",
    name: "유리/세라믹",
    description: "차량용 유리 및 세라믹 소재",
    status: "ACTIVE",
  },
];
