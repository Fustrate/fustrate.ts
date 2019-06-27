import Component from '../Component';
interface PaginationInformation {
    currentPage: number;
    totalPages: number;
    totalEntries: number;
    perPage: number;
}
export default class Pagination extends Component {
    protected static getCurrentPage(): number;
    currentPage: number;
    totalPages: number;
    totalEntries: number;
    perPage: number;
    private base;
    constructor(info: PaginationInformation);
    generate(): HTMLUListElement;
    protected previousLink(): HTMLLIElement;
    protected nextLink(): HTMLLIElement;
    protected windowedPageNumbers(): Array<string | number>;
}
export {};
