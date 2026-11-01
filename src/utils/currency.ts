/**
 * Utility functions for currency conversions and formatting
 */

export const formatKRW = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatTWD = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));
};

export const krwToTWD = (krw: number, exchangeRate: number = 42.0): number => {
  if (!exchangeRate || exchangeRate <= 0) return 0;
  return Math.round(krw / exchangeRate);
};

export const twdToKRW = (twd: number, exchangeRate: number = 42.0): number => {
  return Math.round(twd * (exchangeRate || 42.0));
};

/**
 * South Korea Tax Refund estimate:
 * Single receipt >= 15,000 KRW
 * Refund rate tiers roughly 5% ~ 8%
 */
export const calculateEstimatedTaxRefund = (krw: number): number => {
  if (krw < 15000) return 0;
  // Korea VAT is 10%, refund after processing service fee is approximately 6.5%
  return Math.round(krw * 0.065);
};
