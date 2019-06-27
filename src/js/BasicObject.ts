import moment from 'moment';

import Listenable from './Listenable';
import { deepExtend } from './object';

type ObjectAttributes = { [s: string]: any };

export default class BasicObject extends Listenable {
  public static buildList<T extends BasicObject>(items: ObjectAttributes[], attributes: ObjectAttributes = {}): T[] {
    return items.map(item => <T>(new this(deepExtend(item, attributes))));
  }

  public date?: string | moment.Moment;

  public createdAt?: string | moment.Moment;

  public updatedAt?: string | moment.Moment;

  constructor(data?: object) {
    super();

    if (data) {
      this.extractFromData(data);
    }
  }

  // Simple extractor to assign root keys as properties in the current object.
  // Formats a few common attributes as dates with moment.js
  public extractFromData(data?: ObjectAttributes): ObjectAttributes {
    if (!data) {
      return {};
    }

    Object.defineProperties(this, Object.getOwnPropertyDescriptors(data));

    if (typeof this.date === 'string') {
      this.date = moment(this.date);
    }

    if (typeof this.createdAt === 'string') {
      this.createdAt = moment(this.createdAt);
    }

    if (typeof this.updatedAt === 'string') {
      this.updatedAt = moment(this.updatedAt);
    }

    return data;
  }

  public get isBasicObject(): boolean {
    return true;
  }
}
