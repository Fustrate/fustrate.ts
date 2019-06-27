"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
const event_1 = require("../rails/utils/event");
// Allow files to be dropped onto an element
class DropZone extends Component_1.default {
    static create(target, callback) {
        return new DropZone(target, callback);
    }
    constructor(target, callback) {
        super();
        target.addEventListener('dragover', event_1.stopEverything);
        target.addEventListener('dragenter', event_1.stopEverything);
        target.addEventListener('drop', (event) => {
            event_1.stopEverything(event);
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
