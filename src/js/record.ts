import moment from 'moment';
import ajax, { get } from './ajax';
import { fire } from './rails/utils/event';

import BasicObject from './basic_object';

export default class Record extends BasicObject {
  public static classname: string;

  public static toFormData(data: FormData, obj: object, namespace?: string): FormData {
    Object.getOwnPropertyNames(obj).forEach((field) => {
      if (typeof obj[field] === 'undefined' || Number.isNaN(obj[field])) {
        return;
      }

      const key = namespace ? `${namespace}[${field}]` : field;

      if (obj[field] && typeof obj[field] === 'object') {
        this.appendObjectToFormData(data, key, obj[field]);
      } else if (typeof obj[field] === 'boolean') {
        data.append(key, Number(obj[field]));
      } else if (obj[field] !== null && obj[field] !== undefined) {
        data.append(key, obj[field]);
      }
    });

    return data;
  }

  public static appendObjectToFormData(data: FormData, key: string, value: any): void {
    if (value instanceof Array) {
      value.forEach((item) => {
        data.append(`${key}[]`, item);
      });
    } else if (value instanceof File) {
      data.append(key, value);
    } else if (moment.isMoment(value)) {
      data.append(key, value.format());
    } else if (!(value instanceof Record)) {
      this.toFormData(data, value, key);
    }
  }

  public static get paramKey(): string {
    return this.classname.replace(/::/g, '').replace(/^[A-Z]/, match => match.toLowerCase());
  }

  public static create(attributes): Promise {
    return (new this()).update(attributes);
  }

  constructor(data) {
    super(data);

    this.isLoaded = false;

    if (typeof data === 'number' || typeof data === 'string') {
      // If the parameter was a number or string, it's likely the record ID
      this.id = parseInt(data, 10);
    } else {
      // Otherwise we were probably given a hash of attributes
      this.extractFromData(data);
    }
  }

  public get classname(): string { return this.constructor.classname; }

  public reload({ force } = {}): Promise {
    if (this.isLoaded && !force) {
      return Promise.resolve();
    }

    return get(this.path({ format: 'json' })).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      return response.data;
    });
  }

  public update(attributes = {}): Promise {
    let url: string;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = this.constructor.createPath({ format: 'json' });
    }

    if (this.community && attributes.community_id === undefined) {
      attributes.community_id = this.community.id;
    }

    return ajax({
      data: this.constructor.toFormData(new FormData(), attributes, this.constructor.paramKey),
      method: this.id ? 'patch' : 'post',
      onUploadProgress: (event) => {
        fire(this, 'upload:progress', event);
      },
      url,
    }).catch(() => {}).then((response) => {
      this.extractFromData(response.data);

      this.isLoaded = true;

      return response.data;
    });
  }

  public delete(): Promise {
    return ajax.delete(this.path({ format: 'json' }));
  }
}
