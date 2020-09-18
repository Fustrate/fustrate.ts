declare module '@rails/ujs' {
  export function delegate(
    target: { dispatchEvent: (evt: CustomEvent) => void },
    selector: string,
    event: string,
    callback: (evt?: any) => void,
  ): void;

  export function fire(object: any, name: string, data?: { [s: string]: any }): void;

  export function stopEverything(event: any): void;
}
