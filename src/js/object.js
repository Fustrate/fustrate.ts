export const isPlainObject = (object) => {
  // Do the inexpensive checks first.
  if (typeof object !== 'object' || Array.isArray(object) || object === null) {
    return false;
  }

  // This is a getter on BasicObject
  return !!object.isPlainObject;
};

export const deepExtend = (out, ...rest) => {
  out = out || {};

  rest.filter(obj => obj).forEach((obj) => {
    Object.getOwnPropertyNames(obj).forEach((key) => {
      out[key] = isPlainObject(obj[key]) ? deepExtend(out[key], obj[key]) : obj[key];
    });
  });

  return out;
};
