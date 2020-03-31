import { BasicObject } from './BasicObject';
export interface PathParameters {
    format?: string;
}
export declare class Record extends BasicObject {
    static classname: string;
    private isLoaded;
    id?: number;
    static get paramKey(): string;
    static create(attributes: object): Promise<any>;
    constructor(data?: string | number | object);
    get classname(): string;
    path(parameters: PathParameters): string;
    reload(force?: boolean): Promise<any>;
    static createPath(parameters: PathParameters): string;
    update(attributes?: {}): Promise<any>;
    delete(): Promise<any>;
}
