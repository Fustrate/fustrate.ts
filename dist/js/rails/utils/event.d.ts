declare global {
    interface Element {
        matchesSelector: (selectors: string) => boolean;
        mozMatchesSelector: (selectors: string) => boolean;
        msMatchesSelector: (selectors: string) => boolean;
        oMatchesSelector: (selectors: string) => boolean;
    }
}
export declare const fire: (obj: EventTarget, name: string, data?: any) => boolean;
export declare const stopEverything: (e: Event) => void;
export declare const delegate: (element: EventTarget, selector: string, eventType: string, handler: (...args: any) => boolean | void) => void;
