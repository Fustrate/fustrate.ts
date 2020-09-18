import Listenable from './Listenable';
export declare type JsonData = {
    [s: string]: any;
};
export declare class BasicObject extends Listenable {
    static build<T extends typeof BasicObject>(this: T, data?: {
        [s: string]: any;
    }, attributes?: {
        [s: string]: any;
    }): InstanceType<T>;
    static buildList<T extends typeof BasicObject>(this: T, items: any[], attributes?: {
        [s: string]: any;
    }): InstanceType<T>[];
    id?: number;
    extractFromData(data?: JsonData): JsonData;
    get isBasicObject(): boolean;
}
