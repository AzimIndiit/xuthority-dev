export const formatNumber = (num: number | undefined): string => {
  if (num === undefined || isNaN(num)) {
    return '0';
  }

  if (Math.abs(num) >= 1_000_000) {
    const millions = num / 1_000_000;
    return `${parseFloat(millions.toFixed(1))}M`;
  }

  if (Math.abs(num) >= 1_000) {
    const thousands = num / 1_000;
    return `${parseFloat(thousands.toFixed(1))}K`;
  }

  return num.toString();
}; 