import GenericPage from './GenericPage';
import type { PaginationInformation } from './components/Pagination';
declare type RowSortFunction = (row: HTMLTableRowElement) => string;
export default class GenericTable extends GenericPage {
    protected static noRecordsMessage: string;
    protected static blankRow: string;
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    loadingRow: HTMLTableRowElement | null;
    constructor(table: HTMLTableElement);
    initialize(): void;
    createRow(item: any): HTMLTableRowElement;
    reloadRows(rows: HTMLTableRowElement[], sort?: RowSortFunction): void;
    addRow(row: HTMLTableRowElement): void;
    removeRow(row: HTMLTableRowElement): void;
    updated(): void;
    getCheckedIds(): number[];
    updatePagination(response: PaginationInformation & {
        [s: string]: any;
    }): void;
    checkAll(event?: Event): void;
    uncheckAll(): void;
    reloadTable(): void;
    updateRow(row: HTMLTableRowElement, item: any): void;
}
export {};
