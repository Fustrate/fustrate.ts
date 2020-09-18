export const humanize = (str: string): string => (str
  .replace(/[a-z][A-Z]/, (match) => `${match[0]} ${match[1]}`)
  .replace(/_/g, ' ')
  .toLowerCase());

export const isBlank = (str: string): boolean => (typeof str === 'string' && str.trim() === '')
  || str == null;

export const isPresent = (str: string): boolean => !isBlank(str);

export const parameterize = (str: string): string => (str
  .replace(/[a-z][A-Z]/, (match) => `${match[0]}_${match[1]}`)
  .replace(/[^a-zA-Z0-9\-_]+/, '-') // Turn unwanted chars into the separator
  .replace(/-{2,}/, '-') // No more than one of the separator in a row
  .replace(/^-|-$/, '') // Remove leading/trailing separator.
  .toLowerCase());

export const phoneFormat = (str: string): string => {
  if (/^1?\d{10}$/.test(str)) {
    return str.replace(/1?(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }

  if (/^\d{7}$/.test(str)) {
    return str.replace(/(\d{3})(\d{4})/, '$1-$2');
  }

  return str;
};

// This is far too simple for most cases, but it works for the few things we need
export const pluralize = (str: string): string => {
  if (str[str.length - 1] === 'y') {
    return `${str.substr(0, str.length - 1)}ies`;
  }

  return `${str}s`;
};

export const presence = (str: string): string | undefined => (isBlank(str) ? undefined : str);

export const underscore = (str: string): string => (str
  .replace(/[a-z][A-Z]/, (match) => `${match[0]}_${match[1]}`)
  .replace('::', '/')
  .toLowerCase());
