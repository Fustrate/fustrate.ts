"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ujs_1 = require("@rails/ujs");
const Component_1 = __importDefault(require("../Component"));
// Allow files to be dropped onto an element
class DropZone extends Component_1.default {
    static create(target, callback) {
        return new this(target, callback);
    }
    constructor(target, callback) {
        super();
        target.addEventListener('dragover', ujs_1.stopEverything);
        target.addEventListener('dragenter', ujs_1.stopEverything);
        target.addEventListener('drop', (event) => {
            ujs_1.stopEverything(event);
            const files = [];
            if (event.dataTransfer && event.dataTransfer.files) {
                for (let i = 0, l = event.dataTransfer.files.length; i < l; i += 1) {
                    if (event.dataTransfer.files[i]) {
                        files.push(event.dataTransfer.files[i]);
                    }
                }
            }
            callback(files);
        });
    }
}
exports.default = DropZone;
