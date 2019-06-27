import Listenable from './Listenable';
import { deepExtend } from './object';

type JsonData = { [s: string]: any };

export default class BasicObject extends Listenable {
  public static buildList<T extends BasicObject>(items: JsonData[], attributes: JsonData = {}): T[] {
    return items.map(item => <T>(new this(deepExtend(item, attributes))));
  }

  public id?: number;

  constructor(data?: number | string | JsonData) {
    super();

    if (typeof data === 'number') {
      this.id = data;
    } else if (typeof data === 'string') {
      this.id = parseInt(data, 10);
    } else if (data) {
      this.extractFromData(data);
    }
  }

  // Simple extractor to assign root keys as properties in the current object.
  // Formats a few common attributes as dates with moment.js
  public extractFromData(data?: JsonData): JsonData {
    return data || {};
  }

  public get isBasicObject(): boolean {
    return true;
  }
}
