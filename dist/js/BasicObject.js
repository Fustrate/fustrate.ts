"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Listenable_1 = __importDefault(require("./Listenable"));
const object_1 = require("./object");
class BasicObject extends Listenable_1.default {
    constructor(data) {
        super();
        if (typeof data === 'number') {
            this.id = data;
        }
        else if (typeof data === 'string') {
            this.id = parseInt(data, 10);
        }
        else if (data) {
            this.extractFromData(data);
        }
    }
    static buildList(items, attributes = {}) {
        return items.map(item => (new this(object_1.deepExtend(item, attributes))));
    }
    // Simple extractor to assign root keys as properties in the current object.
    // Formats a few common attributes as dates with moment.js
    extractFromData(data) {
        return data || {};
    }
    get isBasicObject() {
        return true;
    }
}
exports.BasicObject = BasicObject;
