export default abstract class Listenable {
    private listeners;
    constructor();
    addEventListener(type: string, listener: (...args: any[]) => void): void;
    removeEventListener(type: string, listener: (...args: any[]) => void): void;
    dispatchEvent(event: Event): boolean;
}
