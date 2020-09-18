import type { Moment } from 'moment';
declare global {
    interface Window {
        Honeybadger: any;
        CustomEvent: any;
    }
}
declare type FontAwesomeStyles = 'regular' | 'thin' | 'solid' | 'brands';
export declare const animate: (element: HTMLElement, animation: string, callback?: (() => void) | undefined, delay?: number | undefined, speed?: string | undefined) => void;
export declare function elementFromString<T extends HTMLElement>(str: string): T;
export declare function hms(seconds: number, zero?: string): string;
export declare const icon: (types: string, style?: FontAwesomeStyles) => string;
export declare const label: (text: string, type?: string | undefined) => string;
export declare const multilineEscapeHTML: (str?: string | undefined) => string;
export declare const linkTo: (text: string, href: any, options?: {
    [s: string]: string;
} | undefined) => string;
export declare const redirectTo: (href: any) => void;
export declare const toHumanDate: (momentObject: Moment, time?: boolean) => string;
export {};
