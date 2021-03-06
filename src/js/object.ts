export const isPlainObject = (obj: { [s: string]: any }): boolean => {
  // Do the inexpensive checks first.
  if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) {
    return false;
  }

  // This is a getter on BasicObject - any sort of basic record shouldn't be iterated
  return !(obj as any).isBasicObject && obj.constructor.name !== 'Moment';
};

export const deepExtend = (...objects: { [s: string]: any }[]): { [s: string]: any } => {
  const out: { [s: string]: any } = {};

  objects.filter((obj) => obj).forEach((obj) => {
    Object.getOwnPropertyNames(obj).forEach((key) => {
      out[key] = isPlainObject(obj[key]) ? deepExtend(out[key] || {}, obj[key]) : obj[key];
    });
  });

  return out;
};
