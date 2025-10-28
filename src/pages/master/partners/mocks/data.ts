export interface PartnerMaster {
  partnerCode: string;
  partnerName: string;
  partnerType: string;
  businessNumber: string;
  representative: string;
  contact: string;
  phone: string;
  address: string;
  paymentTerms: string;
  creditLimit: number;
  status: string;
  registrationDate: string;
}

export const mockPartnersMaster: PartnerMaster[] = [
  {
    partnerCode: "CUST-001",
    partnerName: "서울대리점",
    partnerType: "고객사",
    businessNumber: "123-45-67890",
    representative: "김대리",
    contact: "kim@seoul-dealer.com",
    phone: "02-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    paymentTerms: "월말결제",
    creditLimit: 50000000,
    status: "활성",
    registrationDate: "2024-01-01",
  },
  {
    partnerCode: "CUST-002",
    partnerName: "부산대리점",
    partnerType: "고객사",
    businessNumber: "234-56-78901",
    representative: "이부장",
    contact: "lee@busan-dealer.com",
    phone: "051-2345-6789",
    address: "부산시 해운대구 센텀로 456",
    paymentTerms: "월말결제",
    creditLimit: 30000000,
    status: "활성",
    registrationDate: "2024-01-05",
  },
  {
    partnerCode: "SUPP-001",
    partnerName: "대한금속",
    partnerType: "공급업체",
    businessNumber: "345-67-89012",
    representative: "박사장",
    contact: "park@daehan-metal.com",
    phone: "031-3456-7890",
    address: "경기도 안산시 단원구 공단로 789",
    paymentTerms: "30일 후 결제",
    creditLimit: 0,
    status: "활성",
    registrationDate: "2023-12-15",
  },
  {
    partnerCode: "SUPP-002",
    partnerName: "한국고무",
    partnerType: "공급업체",
    businessNumber: "456-78-90123",
    representative: "최대표",
    contact: "choi@korea-rubber.com",
    phone: "032-4567-8901",
    address: "인천시 남동구 논현로 321",
    paymentTerms: "45일 후 결제",
    creditLimit: 0,
    status: "활성",
    registrationDate: "2023-12-20",
  },
];
