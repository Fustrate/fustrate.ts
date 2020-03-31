import Listenable from './Listenable';
export declare type JsonData = {
    [s: string]: any;
};
export declare class BasicObject extends Listenable {
    static buildList<T extends BasicObject>(items: JsonData[], attributes?: JsonData): T[];
    id?: number;
    constructor(data?: number | string | JsonData);
    extractFromData(data?: JsonData): JsonData;
    get isBasicObject(): boolean;
}
