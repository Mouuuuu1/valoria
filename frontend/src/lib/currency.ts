// Currency formatting utility for Egyptian Pound (EGP)

export const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} EGP`;
};

export const formatCurrencyShort = (amount: number): string => {
  return `${amount.toFixed(0)} EGP`;
};

export const CURRENCY_SYMBOL = 'EGP';
