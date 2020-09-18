import { BasicObject } from './BasicObject';
export interface PathParameters {
    format?: string;
}
export declare class Record extends BasicObject {
    static classname: string;
    private isLoaded;
    id?: number;
    static get paramKey(): string;
    static create(attributes: {
        [s: string]: any;
    }): Promise<any>;
    constructor(data?: string | number);
    get classname(): string;
    path(parameters: {
        [s: string]: any;
    }): string;
    reload(force?: boolean): Promise<any>;
    static createPath(parameters: {
        [s: string]: any;
    }): string;
    update(attributes: {
        [s: string]: any;
    }, additionalParameters?: {
        [s: string]: any;
    }): Promise<any>;
    delete(params?: {}): Promise<any>;
    private receivedResponse;
}
