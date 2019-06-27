import BasicObject from './BasicObject';
interface PathParameters {
    format?: string;
}
export default class Record extends BasicObject {
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
export {};
