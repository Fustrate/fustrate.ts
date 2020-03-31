export default class Rails {
    static get csrfToken(): string | null;
    static get csrfParam(): string | null;
    static CSRFProtection(xhr: XMLHttpRequest): void;
    static refreshCSRFTokens(): void;
}
