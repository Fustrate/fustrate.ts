import Component from '../Component';
export declare class Flash extends Component {
    static show<T extends typeof Flash>(this: T, message: string, type?: string, icon?: string): InstanceType<T>;
    constructor(message: string, type?: string, icon?: string);
}
export declare class InfoFlash extends Flash {
    constructor(message: string, icon?: string);
}
export declare class SuccessFlash extends Flash {
    constructor(message: string, icon?: string);
}
export declare class ErrorFlash extends Flash {
    constructor(message: string, icon?: string);
}
