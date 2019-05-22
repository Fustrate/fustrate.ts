import moment from 'moment';
import { deepExtend } from './object';

import Listenable from './listenable';

export default class BasicObject extends Listenable {
  constructor(data) {
    super(data);

    this.extractFromData(data);
  }

  // Simple extractor to assign root keys as properties in the current object.
  // Formats a few common attributes as dates with moment.js
  extractFromData(data) {
    if (!data) {
      return;
    }

    Object.getOwnPropertyNames(data).forEach((key) => {
      this[key] = data[key];
    }, this);

    if (this.date) {
      this.date = moment(this.date);
    }

    if (this.createdAt) {
      this.createdAt = moment(this.createdAt);
    }

    if (this.updatedAt) {
      this.updatedAt = moment(this.updatedAt);
    }
  }

  get isPlainObject() { return true; }

  static buildList(items, attributes = {}) {
    return items.map(item => new this(deepExtend({}, item, attributes)));
  }
}
