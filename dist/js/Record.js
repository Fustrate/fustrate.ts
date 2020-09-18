"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Record = void 0;
const ujs_1 = require("@rails/ujs");
const ajax_1 = __importDefault(require("./ajax"));
const BasicObject_1 = require("./BasicObject");
const FormDataBuilder_1 = __importDefault(require("./FormDataBuilder"));
class Record extends BasicObject_1.BasicObject {
    constructor(data) {
        super();
        this.isLoaded = false;
        // If the parameter was a number or string, it's likely the record ID
        if (typeof data === 'number' || typeof data === 'string') {
            this.id = parseInt(String(data), 10);
        }
        this.isLoaded = false;
    }
    static get paramKey() {
        return this.classname.replace(/::/g, '').replace(/^[A-Z]/, (match) => match.toLowerCase());
    }
    static create(attributes) {
        return (new this()).update(attributes);
    }
    get classname() {
        return this.constructor.classname;
    }
    path(parameters) {
        return `/?format=${parameters.format}`;
    }
    reload(force = false) {
        if (this.isLoaded && !force) {
            return Promise.resolve();
        }
        return ajax_1.default.get(this.path({ format: 'json' })).then(this.receivedResponse.bind(this));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static createPath(parameters) {
        throw new Error('createPath not implemented.');
    }
    update(attributes, additionalParameters) {
        let url;
        if (this.id) {
            url = this.path({ format: 'json' });
        }
        else {
            this.extractFromData(attributes);
            url = this.constructor.createPath({ format: 'json' });
        }
        const data = FormDataBuilder_1.default.build(attributes, this.constructor.paramKey);
        if (additionalParameters) {
            Object.keys(additionalParameters).forEach((key) => {
                data.append(key, additionalParameters[key]);
            });
        }
        return ajax_1.default({
            method: this.id ? 'patch' : 'post',
            url,
            data,
            onUploadProgress: (event) => {
                ujs_1.fire(this, 'upload:progress', event);
            },
        }).catch(() => {
            // Capture any error
        }).then(this.receivedResponse.bind(this));
    }
    delete(params = {}) {
        return ajax_1.default.delete(this.path({ format: 'json' }), { params });
    }
    receivedResponse(response) {
        if (!response) {
            return {};
        }
        this.extractFromData(response.data);
        this.isLoaded = true;
        return response.data;
    }
}
exports.Record = Record;
