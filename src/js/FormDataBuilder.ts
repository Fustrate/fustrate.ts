import { BasicObject } from './BasicObject';

const moment = require('moment');

export default class FormDataBuilder {
  public static build(obj: { [s: string]: any }, namespace?: string): FormData {
    return this.toFormData(new FormData(), obj, namespace);
  }

  private static appendObjectToFormData(data: FormData, key: string, value: any): void {
    if (value instanceof Array) {
      value.forEach((item) => {
        data.append(`${key}[]`, String(item));
      });
    } else if (value instanceof File) {
      data.append(key, value);
    } else if (moment.isMoment(value)) {
      data.append(key, value.format());
    } else if (!(value instanceof BasicObject)) {
      this.toFormData(data, value, key);
    }
  }

  private static toFormData(data: FormData, obj: { [s: string]: any }, namespace?: string): FormData {
    Object.getOwnPropertyNames(obj).forEach((field) => {
      if (typeof obj[field] === 'undefined' || Number.isNaN(obj[field])) {
        return;
      }

      const key = namespace ? `${namespace}[${field}]` : field;

      if (obj[field] && typeof obj[field] === 'object') {
        this.appendObjectToFormData(data, key, obj[field]);
      } else if (typeof obj[field] === 'boolean') {
        data.append(key, String(Number(obj[field])));
      } else if (obj[field] !== null && obj[field] !== undefined) {
        data.append(key, obj[field]);
      }
    });

    return data;
  }
}
