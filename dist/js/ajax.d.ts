import { AxiosRequestConfig } from 'axios';
declare const instance: import("axios").AxiosInstance;
export declare const get: (url: string, config?: AxiosRequestConfig | undefined, raise?: boolean | undefined) => Promise<any>;
export declare const post: (url: string, data: any, config?: AxiosRequestConfig | undefined, raise?: boolean | undefined) => Promise<any>;
export declare const patch: (url: string, data: any, config?: AxiosRequestConfig | undefined, raise?: boolean | undefined) => Promise<any>;
export declare const when: (...requests: Promise<any>[]) => Promise<any>;
export declare const getCurrentPageJson: () => Promise<any>;
export default instance;
