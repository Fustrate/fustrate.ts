import { fire } from '@rails/ujs';
import { AxiosResponse } from 'axios';

import ajax from './ajax';

import { BasicObject } from './BasicObject';
import FormDataBuilder from './FormDataBuilder';

export interface PathParameters {
  format?: string;
}

export class Record extends BasicObject {
  public static classname: string;

  private isLoaded = false;

  public id?: number;

  public static get paramKey(): string {
    return this.classname.replace(/::/g, '').replace(/^[A-Z]/, (match) => match.toLowerCase());
  }

  public static create(attributes: { [s: string]: any }): Promise<any> {
    return (new this()).update(attributes);
  }

  constructor(data?: string | number) {
    super();

    // If the parameter was a number or string, it's likely the record ID
    if (typeof data === 'number' || typeof data === 'string') {
      this.id = parseInt(String(data), 10);
    }

    this.isLoaded = false;
  }

  public get classname(): string {
    return (this.constructor as typeof Record).classname;
  }

  public path(parameters: { [s: string]: any }): string {
    return `/?format=${parameters.format}`;
  }

  public reload(force = false): Promise<any> {
    if (this.isLoaded && !force) {
      return Promise.resolve();
    }

    return ajax.get(this.path({ format: 'json' })).then(this.receivedResponse.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static createPath(parameters: { [s: string]: any }): string {
    throw new Error('createPath not implemented.');
  }

  public update(attributes: { [s: string]: any }, additionalParameters?: { [s: string]: any }): Promise<any> {
    let url: string;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = (this.constructor as typeof Record).createPath({ format: 'json' });
    }

    const data = FormDataBuilder.build(attributes, (this.constructor as typeof Record).paramKey);

    if (additionalParameters) {
      Object.keys(additionalParameters).forEach((key) => {
        data.append(key, additionalParameters[key]);
      });
    }

    return ajax({
      method: this.id ? 'patch' : 'post',
      url,
      data,
      onUploadProgress: (event) => {
        fire(this, 'upload:progress', event);
      },
    }).catch(() => {
      // Capture any error
    }).then(this.receivedResponse.bind(this));
  }

  public delete(params = {}): Promise<any> {
    return ajax.delete(this.path({ format: 'json' }), { params });
  }

  private receivedResponse(response: void | AxiosResponse<any>): any {
    if (!response) {
      return {};
    }

    this.extractFromData(response.data);

    this.isLoaded = true;

    return response.data;
  }
}
