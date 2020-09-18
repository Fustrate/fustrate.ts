"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicObject = void 0;
const Listenable_1 = __importDefault(require("./Listenable"));
class BasicObject extends Listenable_1.default {
    static build(data, attributes) {
        if (data instanceof this) {
            return data;
        }
        if (typeof data === 'string' || typeof data === 'number') {
            data = { id: data };
        }
        const record = new this();
        if (data) {
            record.extractFromData(Object.assign(Object.assign({}, data), attributes));
        }
        return record;
    }
    static buildList(items, attributes) {
        return items.map((item) => this.build(item, attributes));
    }
    // Simple extractor to assign root keys as properties in the current object.
    // Formats a few common attributes as dates with moment.js
    extractFromData(data) {
        if (!data) {
            return {};
        }
        Object.assign(this, data);
        // Object.getOwnPropertyNames(data).forEach((key) => {
        //   this[key] = data[key];
        // }, this);
        return data;
    }
    get isBasicObject() {
        return true;
    }
}
exports.BasicObject = BasicObject;
