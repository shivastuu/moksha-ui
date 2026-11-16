/** Keeps digits only */
export const digitsOnly = (text: string) => text.replace(/\D/g, '');

/** Splits digits into groups, for example [5, 5] → "98765 43210" */
export function groupDigits(digits: string, groups: number[], separator = ' ') {
  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) {
      break;
    }
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  if (index < digits.length) {
    parts.push(digits.slice(index));
  }
  return parts.join(separator);
}

/** Indian mobile number: "98765 43210" */
export const formatPhone = (digits: string) => groupDigits(digits, [5, 5]);

/** 10 digits starting with 6–9 */
export const isValidIndianMobile = (digits: string) => /^[6-9]\d{9}$/.test(digits);

/**
 * Keeps a typed amount as a plain number string: digits and one decimal point,
 * at most `decimals` decimal places, no leading zeros. "₹ 0012,34.567" → "1234.56"
 */
export function parseAmount(text: string, decimals = 2) {
  const cleaned = text.replace(/[^\d.]/g, '');
  const dot = cleaned.indexOf('.');
  const whole = (dot === -1 ? cleaned : cleaned.slice(0, dot)).replace(/^0+(?=\d)/, '');
  if (dot === -1 || decimals === 0) {
    return whole;
  }
  const fraction = cleaned.slice(dot + 1).replace(/\./g, '').slice(0, decimals);
  return `${whole || '0'}.${fraction}`;
}

/** Indian digit grouping: "1234567.5" → "12,34,567.5" */
export function formatAmount(value: string) {
  if (!value) {
    return '';
  }
  const [whole = '', fraction] = value.split('.');
  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const grouped = rest ? `${rest},${lastThree}` : lastThree;
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

/** Bank account number in groups of four: "1234 5678 9012" */
export const formatAccountNumber = (digits: string) => groupDigits(digits, Array(5).fill(4));

/** Hides all but the last `visible` digits: "•••• •••• 9012" */
export function maskAccountNumber(digits: string, visible = 4) {
  if (digits.length <= visible) {
    return digits;
  }
  return formatAccountNumber('•'.repeat(digits.length - visible) + digits.slice(-visible));
}

/** Indian bank account numbers are 9 to 18 digits */
export const isValidAccountNumber = (digits: string) => /^\d{9,18}$/.test(digits);
