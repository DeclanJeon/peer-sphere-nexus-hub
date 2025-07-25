import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CurrencyOptions = {
  locale?: string;
  currency?: 'KRW' | 'USD' | 'EUR' | 'JPY' | 'CNY';
  showSymbol?: boolean;
  showDecimals?: boolean;
  customSymbol?: string;
};

/**
 * Formats a number as a price string with currency symbol and proper formatting
 * @param price - The price to format
 * @param options - Formatting options
 * @returns Formatted price string
 *
 * @example
 * formatPrice(1000) // '1,000원'
 * formatPrice(1000, { currency: 'USD' }) // '$1,000.00'
 * formatPrice(1000, { showSymbol: false }) // '1,000'
 * formatPrice(1000, { customSymbol: '₩' }) // '₩1,000'
 */
export function formatPrice(
  price: number,
  options: CurrencyOptions = {}
): string {
  const {
    locale = 'ko-KR',
    currency = 'KRW',
    showSymbol = true,
    showDecimals = currency !== 'KRW',
    customSymbol,
  } = options;

  // Handle invalid price
  if (isNaN(price) || !isFinite(price)) {
    return showSymbol ? (customSymbol || '₩') + '0' : '0';
  }

  // Format the number
  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol && !customSymbol ? 'currency' : 'decimal',
    currency: showSymbol && !customSymbol ? currency : undefined,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  let result = formatter.format(price);

  // Apply custom symbol if provided
  if (customSymbol) {
    result = showSymbol ? `${customSymbol}${result}` : result;
  } else if (currency === 'KRW' && !showSymbol) {
    // Special handling for KRW without symbol
    result = result.replace(/\s?[^\d,.-]+/g, '');
  }

  return (
    result + (currency === 'KRW' && showSymbol && !customSymbol ? '원' : '')
  );
}

export const formatEmailToId = (currentUserId: string) => {
  let extractedId = '';
  if (currentUserId) {
    const atIndex = currentUserId.indexOf('@');
    if (atIndex !== -1) {
      // '@'가 포함되어 있다면 '@' 왼쪽 부분만 추출
      extractedId = currentUserId.substring(0, atIndex);
    } else {
      // '@'가 포함되어 있지 않다면 전체를 아이디로 간주
      extractedId = currentUserId;
    }
  }

  return extractedId;
};
