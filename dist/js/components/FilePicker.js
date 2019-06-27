"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Component_1 = __importDefault(require("../Component"));
// Turn any element into a trigger for file selection.
class FilePicker extends Component_1.default {
    constructor(callback) {
        super();
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.addEventListener('change', () => {
            const files = [];
            if (input.files) {
                for (let i = 0, l = input.files.length; i < l; i += 1) {
                    if (input.files[i]) {
                        files.push(input.files[i]);
                    }
                }
            }
            callback(files);
            input.remove();
        });
        document.body.appendChild(input);
        input.click();
    }
}
exports.default = FilePicker;
