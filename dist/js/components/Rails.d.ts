export default class Rails {
    static readonly csrfToken: string | null;
    static readonly csrfParam: string | null;
    static CSRFProtection(xhr: XMLHttpRequest): void;
    static refreshCSRFTokens(): void;
}
