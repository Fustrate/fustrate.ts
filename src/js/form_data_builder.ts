import BasicObject from './basic_object';

const moment = require('moment');

const appendObjectToFormData = (data: FormData, key: string, value: any): void => {
  if (value instanceof Array) {
    value.forEach((item) => {
      data.append(`${key}[]`, item);
    });
  } else if (value instanceof File) {
    data.append(key, value);
  } else if (moment.isMoment(value)) {
    data.append(key, value.format());
  } else if (!(value instanceof BasicObject)) {
    this.toFormData(data, value, key);
  }
};

export default (data: FormData, obj: object, namespace?: string): FormData => {
  Object.getOwnPropertyNames(obj).forEach((field) => {
    if (typeof obj[field] === 'undefined' || Number.isNaN(obj[field])) {
      return;
    }

    const key = namespace ? `${namespace}[${field}]` : field;

    if (obj[field] && typeof obj[field] === 'object') {
      appendObjectToFormData(data, key, obj[field]);
    } else if (typeof obj[field] === 'boolean') {
      data.append(key, String(Number(obj[field])));
    } else if (obj[field] !== null && obj[field] !== undefined) {
      data.append(key, obj[field]);
    }
  });

  return data;
};
