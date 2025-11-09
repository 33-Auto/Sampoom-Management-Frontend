export const formatNumber = (value: number) => value.toLocaleString("ko-KR");

export const formatCurrency = (value: number) =>
  `₩${formatNumber(Math.round(value))}`;
