export type BranchRecord = {
  id: number;
  name: string;
  code: string;
  type: "WAREHOUSE" | "FACTORY";
  address: string;
  status: "ACTIVE" | "INACTIVE";
};

export const mockBranchRecords: BranchRecord[] = [
  {
    id: 201,
    name: "인천 물류센터",
    code: "BR-WH-ICN",
    type: "WAREHOUSE",
    address: "인천광역시 서구 가좌동 123-45",
    status: "ACTIVE",
  },
  {
    id: 202,
    name: "대구 생산공장",
    code: "BR-FC-DGU",
    type: "FACTORY",
    address: "대구광역시 달성군 현풍읍 테크노대로 88",
    status: "ACTIVE",
  },
  {
    id: 203,
    name: "부산 항만 창고",
    code: "BR-WH-BUS",
    type: "WAREHOUSE",
    address: "부산광역시 영도구 남항로 10",
    status: "INACTIVE",
  },
  {
    id: 204,
    name: "경기 물류센터",
    code: "BR-WH-GYE",
    type: "WAREHOUSE",
    address: "경기도 안양시 만안구 안양로 234",
    status: "ACTIVE",
  },
  {
    id: 205,
    name: "천안 물류센터",
    code: "BR-WH-CHE",
    type: "WAREHOUSE",
    address: "충청남도 천안시 서북구 성거읍 성거로 567",
    status: "ACTIVE",
  },
  {
    id: 104,
    name: "안산 4공장",
    code: "BR-FC-ANSAN",
    type: "FACTORY",
    address: "경기도 안산시 단원구 공단로 789",
    status: "ACTIVE",
  },
  {
    id: 105,
    name: "평택 5공장",
    code: "BR-FC-PYONG",
    type: "FACTORY",
    address: "경기도 평택시 진위면 평택대로 123",
    status: "ACTIVE",
  },
  {
    id: 206,
    name: "송파 창고",
    code: "BR-WH-SON",
    type: "WAREHOUSE",
    address: "서울특별시 송파구 올림픽로 890",
    status: "ACTIVE",
  },
  {
    id: 207,
    name: "화성 물류센터",
    code: "BR-WH-HWA",
    type: "WAREHOUSE",
    address: "경기도 화성시 동탄대로 123",
    status: "ACTIVE",
  },
];
