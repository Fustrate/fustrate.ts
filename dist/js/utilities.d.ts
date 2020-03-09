import moment from 'moment';
export declare const escapeHTML: (string?: string | undefined) => string;
declare global {
    interface Window {
        Honeybadger: any;
        CustomEvent: any;
    }
}
export declare const animate: (element: HTMLElement, animation: string, callback?: (() => void) | undefined, delay?: number | undefined, speed?: string | undefined) => void;
export declare function debounce(func: (...args: any[]) => void, delay?: number): (...args: any[]) => void;
export declare function elementFromString<T extends HTMLElement>(str: string): T;
export declare function hms(seconds: number, zero?: string): string;
declare type FontAwesomeStyles = 'regular' | 'thin' | 'solid' | 'brands';
export declare const icon: (types: string, style?: FontAwesomeStyles) => string;
export declare const label: (text: string, type?: string | undefined) => string;
export declare const multilineEscapeHTML: (str?: string | undefined) => string;
export declare const linkTo: (text: string, href: any, options?: {
    [s: string]: string;
} | undefined) => string;
export declare const redirectTo: (href: any) => void;
export declare const triggerEvent: (element: Element, name: string, data?: {}) => void;
export declare const isVisible: (elem: HTMLElement) => boolean;
export declare const toggle: (element: HTMLElement | NodeListOf<HTMLElement>, showOrHide: boolean | undefined) => void;
export declare const show: (element: HTMLElement) => void;
export declare const hide: (element: HTMLElement) => void;
export declare const toHumanDate: (momentObject: moment.Moment, time?: boolean) => string;
export { delegate } from './rails/utils/event';
