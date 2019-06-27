import Listenable from './Listenable';
declare type JsonData = {
    [s: string]: any;
};
export default class BasicObject extends Listenable {
    static buildList<T extends BasicObject>(items: JsonData[], attributes?: JsonData): T[];
    id?: number;
    constructor(data?: number | string | JsonData);
    extractFromData(data?: JsonData): JsonData;
    readonly isBasicObject: boolean;
}
export {};
