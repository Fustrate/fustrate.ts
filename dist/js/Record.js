"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajax_1 = __importStar(require("./ajax"));
const event_1 = require("./rails/utils/event");
const BasicObject_1 = require("./BasicObject");
const FormDataBuilder_1 = __importDefault(require("./FormDataBuilder"));
class Record extends BasicObject_1.BasicObject {
    constructor(data) {
        super(typeof data !== 'number' && typeof data !== 'string' ? data : undefined);
        this.isLoaded = false;
        // If the parameter was a number or string, it's likely the record ID
        if (typeof data === 'number') {
            this.id = data;
        }
        else if (typeof data === 'string') {
            this.id = parseInt(data, 10);
        }
    }
    static get paramKey() {
        return this.classname.replace(/::/g, '').replace(/^[A-Z]/, match => match.toLowerCase());
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
        return ajax_1.get(this.path({ format: 'json' })).then((response) => {
            if (response) {
                this.extractFromData(response.data);
                this.isLoaded = true;
                return response.data;
            }
            return {};
        });
    }
    static createPath(parameters) {
        return `/?format=${parameters.format}`;
    }
    update(attributes = {}) {
        let url;
        if (this.id) {
            url = this.path({ format: 'json' });
        }
        else {
            this.extractFromData(attributes);
            url = this.constructor.createPath({ format: 'json' });
        }
        return ajax_1.default({
            data: FormDataBuilder_1.default.build(attributes, this.constructor.paramKey),
            method: this.id ? 'patch' : 'post',
            onUploadProgress: (event) => {
                event_1.fire(this, 'upload:progress', event);
            },
            url,
        }).catch(() => { }).then((response) => {
            if (!response) {
                return {};
            }
            this.extractFromData(response.data);
            this.isLoaded = true;
            return response.data;
        });
    }
    delete() {
        return ajax_1.default.delete(this.path({ format: 'json' }));
    }
}
exports.Record = Record;
