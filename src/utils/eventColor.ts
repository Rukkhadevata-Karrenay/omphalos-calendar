export const EVENT_GRADIENT_BORDER_FALLBACK = '#f1d890';

export const isGradientColor = (color: string): boolean => color.includes('gradient(');

export const getEventBorderColor = (color: string): string =>
  isGradientColor(color) ? EVENT_GRADIENT_BORDER_FALLBACK : color;
