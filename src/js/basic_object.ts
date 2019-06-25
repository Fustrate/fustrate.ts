import moment from "moment";

import Listenable from "./listenable";
import { deepExtend } from "./object";

export default class BasicObject extends Listenable <T> {
  public static buildList(items, attributes = {}): T[] {
    return items.map((item) => new this(deepExtend({}, item, attributes)));
  }

  constructor(data) {
    super(data);

    this.extractFromData(data);
  }

  // Simple extractor to assign root keys as properties in the current object.
  // Formats a few common attributes as dates with moment.js
  public extractFromData(data: object | null | undefined): object {
    if (!data) {
      return {};
    }

    Object.getOwnPropertyNames(data).forEach((key) => {
      this[key] = data[key];
    }, this);

    if (typeof this.date === "string") {
      this.date = moment(this.date);
    }

    if (typeof this.createdAt === "string") {
      this.createdAt = moment(this.createdAt);
    }

    if (typeof this.updatedAt === "string") {
      this.updatedAt = moment(this.updatedAt);
    }

    return data;
  }

  public get isBasicObject(): boolean { return true; }
}
