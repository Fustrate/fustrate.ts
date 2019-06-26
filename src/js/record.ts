import ajax, { get } from './ajax';
import { fire } from './rails/utils/event';

import BasicObject from './basic_object';
import toFormData from './form_data_builder';

interface PathParameters {
  format?: string;
}

export default class Record extends BasicObject {
  public static classname: string;

  private isLoaded: boolean = false;

  public id: number;

  public static get paramKey(): string {
    return this.classname.replace(/::/g, '').replace(/^[A-Z]/, match => match.toLowerCase());
  }

  public static create(attributes): Promise<any> {
    return (new this()).update(attributes);
  }

  constructor(data?: string | number | object) {
    super(typeof data !== 'number' && typeof data !== 'string' ? data : undefined);

    // If the parameter was a number or string, it's likely the record ID
    if (typeof data === 'number') {
      this.id = data;
    } else if (typeof data === 'string') {
      this.id = parseInt(data, 10);
    }
  }

  public get classname(): string {
    return (this.constructor as typeof Record).classname;
  }

  public path(parameters: PathParameters): string {
    return `/?format=${parameters.format}`;
  }

  public reload(force: boolean = false): Promise<any> {
    if (this.isLoaded && !force) {
      return Promise.resolve();
    }

    return get(this.path({ format: 'json' })).then((response) => {
      if (response) {
        this.extractFromData(response.data);

        this.isLoaded = true;

        return response.data;
      }

      return {};
    });
  }

  public static createPath(parameters: PathParameters): string {
    return `/?format=${parameters.format}`;
  }

  public update(attributes = {}): Promise<any> {
    let url: string;

    if (this.id) {
      url = this.path({ format: 'json' });
    } else {
      this.extractFromData(attributes);

      url = (this.constructor as typeof Record).createPath({ format: 'json' });
    }

    return ajax({
      data: toFormData(new FormData(), attributes, (this.constructor as typeof Record).paramKey),
      method: this.id ? 'patch' : 'post',
      onUploadProgress: (event) => {
        fire(this, 'upload:progress', event);
      },
      url,
    }).catch(() => {}).then((response) => {
      if (!response) {
        return {};
      }

      this.extractFromData(response.data);

      this.isLoaded = true;

      return response.data;
    });
  }

  public delete(): Promise<any> {
    return ajax.delete(this.path({ format: 'json' }));
  }
}
