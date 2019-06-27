import GenericPage from './GenericPage';
declare type RowSortFunction = (row: HTMLTableRowElement) => string;
export default class GenericTable extends GenericPage {
    private static noRecordsMessage;
    private static blankRow;
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
    updatePagination(response: any): void;
    checkAll(event?: Event): void;
    uncheckAll(): void;
    reloadTable(): void;
    updateRow(row: HTMLTableRowElement, item: any): void;
}
export {};
