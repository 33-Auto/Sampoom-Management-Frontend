export type FactoryBranch = {
  id: number;
  code: string;
  name: string;
  region: string;
  status: "ACTIVE" | "INACTIVE";
  capacityRate: number;
};

export const mockFactoryBranches: FactoryBranch[] = [
  {
    id: 101,
    code: "FAC-SEOUL",
    name: "서울 1공장",
    region: "서울",
    status: "ACTIVE",
    capacityRate: 0.82,
  },
  {
    id: 102,
    code: "FAC-GWANGJU",
    name: "광주 2공장",
    region: "광주",
    status: "ACTIVE",
    capacityRate: 0.67,
  },
  {
    id: 103,
    code: "FAC-ULSAN",
    name: "울산 3공장",
    region: "울산",
    status: "INACTIVE",
    capacityRate: 0.0,
  },
  {
    id: 104,
    code: "FAC-ANSAN",
    name: "안산 4공장",
    region: "안산",
    status: "ACTIVE",
    capacityRate: 0.75,
  },
  {
    id: 105,
    code: "FAC-PYONG",
    name: "평택 5공장",
    region: "평택",
    status: "ACTIVE",
    capacityRate: 0.88,
  },
  {
    id: 106,
    code: "FAC-CHEON",
    name: "천안 6공장",
    region: "천안",
    status: "ACTIVE",
    capacityRate: 0.65,
  },
  {
    id: 107,
    code: "FAC-GUMI",
    name: "구미 7공장",
    region: "구미",
    status: "ACTIVE",
    capacityRate: 0.72,
  },
  {
    id: 108,
    code: "FAC-CHANG",
    name: "창원 8공장",
    region: "창원",
    status: "ACTIVE",
    capacityRate: 0.8,
  },
];
