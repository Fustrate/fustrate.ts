import Listenable from './Listenable';

export type JsonData = { [s: string]: any };

export class BasicObject extends Listenable {
  static build<T extends typeof BasicObject>(this: T, data?: { [s: string]: any }, attributes?: { [s: string]: any }):
    InstanceType<T> {
    if (data instanceof this) {
      return data as InstanceType<T>;
    }

    if (typeof data === 'string' || typeof data === 'number') {
      data = { id: data };
    }

    const record = new this();

    if (data) {
      record.extractFromData({ ...data, ...attributes });
    }

    return record as InstanceType<T>;
  }

  public static buildList<T extends typeof BasicObject>(this: T, items: any[], attributes?: { [s: string]: any }):
    InstanceType<T>[] {
    return items.map((item) => this.build(item, attributes));
  }

  public id?: number;

  // Simple extractor to assign root keys as properties in the current object.
  // Formats a few common attributes as dates with moment.js
  public extractFromData(data?: JsonData): JsonData {
    if (!data) {
      return {};
    }

    Object.assign(this, data);

    // Object.getOwnPropertyNames(data).forEach((key) => {
    //   this[key] = data[key];
    // }, this);

    return data;
  }

  public get isBasicObject(): boolean {
    return true;
  }
}
