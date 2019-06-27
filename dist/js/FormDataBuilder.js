"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BasicObject_1 = __importDefault(require("./BasicObject"));
const moment = require('moment');
class FormDataBuilder {
    static build(obj, namespace) {
        return this.toFormData(new FormData(), obj, namespace);
    }
    static appendObjectToFormData(data, key, value) {
        if (value instanceof Array) {
            value.forEach((item) => {
                data.append(`${key}[]`, String(item));
            });
        }
        else if (value instanceof File) {
            data.append(key, value);
        }
        else if (moment.isMoment(value)) {
            data.append(key, value.format());
        }
        else if (!(value instanceof BasicObject_1.default)) {
            this.toFormData(data, value, key);
        }
    }
    static toFormData(data, obj, namespace) {
        Object.getOwnPropertyNames(obj).forEach((field) => {
            if (typeof obj[field] === 'undefined' || Number.isNaN(obj[field])) {
                return;
            }
            const key = namespace ? `${namespace}[${field}]` : field;
            if (obj[field] && typeof obj[field] === 'object') {
                this.appendObjectToFormData(data, key, obj[field]);
            }
            else if (typeof obj[field] === 'boolean') {
                data.append(key, String(Number(obj[field])));
            }
            else if (obj[field] !== null && obj[field] !== undefined) {
                data.append(key, obj[field]);
            }
        });
        return data;
    }
}
exports.default = FormDataBuilder;
