export const accountingFormat = (num: number): string => (num < 0
  ? `($${(num * -1).toFixed(2)})`
  : `$${num.toFixed(2)}`);

export const truncate = (num: number, digits = 2): string => num.toFixed(digits).replace(/\.?0+$/, '');

export const bytesToString = (num: number): string => {
  if (num < 1000) {
    return `${num} B`;
  }

  if (num < 1000000) {
    return `${truncate(num / 1000)} kB`;
  }

  if (num < 1000000000) {
    return `${truncate(num / 1000000)} MB`;
  }

  return `${truncate(num / 1000000000)} GB`;
};

export const ordinalize = (num: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const remainder = num % 100;

  return num + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || 'th');
};
