import { dailyQuotes, type DailyQuote } from '../data/dailyQuotes';
import { toDateKey } from './date';

const hashText = (text: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const getDailyQuote = (date: Date, monthOrder: number): DailyQuote => {
  const monthQuotes = dailyQuotes.filter((quote) => quote.monthOrder === monthOrder);
  const globalQuotes = dailyQuotes.filter((quote) => quote.monthOrder === undefined);
  const pool = monthQuotes.length > 0 ? [...monthQuotes, ...globalQuotes] : dailyQuotes;
  const index = hashText(`${toDateKey(date)}:${monthOrder}`) % pool.length;

  const quote = pool[index];
  return {
    ...quote,
    text: normalizeDailyQuoteText(quote.text),
  };
};

export const getDailyQuoteTypeLabel = (type: DailyQuote['type']): string =>
  type === 'official' ? '游戏原句' : '';

const balanceCornerQuotes = (text: string): string => {
  const openCount = [...text.matchAll(/「/g)].length;
  const closeCount = [...text.matchAll(/」/g)].length;
  if (openCount > closeCount) {
    return `${text}${'」'.repeat(openCount - closeCount)}`;
  }
  if (closeCount > openCount) {
    return `${'「'.repeat(closeCount - openCount)}${text}`;
  }
  return text;
};

export const normalizeDailyQuoteText = (text: string): string => {
  const normalized = text
    .replace(/[【\[\{\(\"“]/g, '「')
    .replace(/[】\]\}\)\"”]/g, '」')
    .replace(/[。.](?=」?$)/, '');
  return balanceCornerQuotes(normalized);
};
