import { BasicObject } from './BasicObject';
export interface PathParameters {
    format?: string;
}
export declare class Record extends BasicObject {
    static classname: string;
    private isLoaded;
    id?: number;
    static readonly paramKey: string;
    static create(attributes: object): Promise<any>;
    constructor(data?: string | number | object);
    readonly classname: string;
    path(parameters: PathParameters): string;
    reload(force?: boolean): Promise<any>;
    static createPath(parameters: PathParameters): string;
    update(attributes?: {}): Promise<any>;
    delete(): Promise<any>;
}
