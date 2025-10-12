export const formatNumber = (value: number) => value.toLocaleString("ko-KR");

export const formatCurrency = (value: number) => {
  const rounded = Math.round(value);
  if (Math.abs(rounded) >= 10_000) {
    const unitValue = rounded / 10_000;
    const formatted = unitValue.toLocaleString("ko-KR", {
      maximumFractionDigits: unitValue >= 10 ? 0 : 1,
      minimumFractionDigits: unitValue >= 10 ? 0 : 1,
    });
    return `₩${formatted}만원`;
  }
  return `₩${formatNumber(rounded)}`;
};
