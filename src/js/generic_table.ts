import Pagination from './components/pagination';
import GenericPage from './generic_page';
import { elementFromString } from './utilities';

type RowSortFunction = (row: HTMLTableRowElement) => string;

const sortRows = (rows: HTMLTableRowElement[], sortFunction: RowSortFunction): HTMLTableRowElement[] => {
  const rowsWithSortOrder = rows.map(row => [sortFunction(row), row]);

  rowsWithSortOrder.sort((x, y) => {
    if (x[0] === y[0]) {
      return 0;
    }

    return x[0] > y[0] ? 1 : -1;
  });

  return rowsWithSortOrder.map(row => row[1]) as HTMLTableRowElement[];
};

export default class GenericTable extends GenericPage {
  private static noRecordsMessage = 'No records found.';

  private static blankRow: string;

  public table: HTMLTableElement;

  public tbody: HTMLTableSectionElement;

  public loadingRow: HTMLTableRowElement | null;

  constructor(table: HTMLTableElement) {
    super();

    this.table = table;
    [this.tbody] = this.table.tBodies;
    this.loadingRow = this.tbody.querySelector<HTMLTableRowElement>('tr.loading');
  }

  public initialize() {
    super.initialize();

    this.reloadTable();
  }

  public createRow(item: any): HTMLTableRowElement {
    const row: HTMLTableRowElement = elementFromString((this.constructor as typeof GenericTable).blankRow);

    this.updateRow(row, item);

    return row;
  }

  public reloadRows(rows: HTMLTableRowElement[], sort?: RowSortFunction): void {
    if (this.loadingRow) {
      this.loadingRow.style.display = 'none';
    }

    if (rows) {
      this.tbody.querySelectorAll<HTMLTableRowElement>('tr:not(.no-records):not(.loading)').forEach((row) => {
        row.remove();
      });

      (sort ? sortRows(rows, sort) : rows).forEach((row: HTMLTableRowElement) => {
        this.tbody.appendChild(row);
      });
    }

    this.updated();
  }

  public addRow(row: HTMLTableRowElement): void {
    this.tbody.appendChild(row);

    this.updated();
  }

  public removeRow(row: HTMLTableRowElement): void {
    row.remove();

    this.updated();
  }

  public updated(): void {
    if (this.tbody.querySelectorAll('tr:not(.no-records):not(.loading)').length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');

      tr.classList.add('no-records');

      td.colSpan = 16;
      td.textContent = (this.constructor as typeof GenericTable).noRecordsMessage;

      tr.appendChild(td);
      this.tbody.appendChild(tr);
    }
  }

  public getCheckedIds(): number[] {
    return Array.from(this.tbody.querySelectorAll<HTMLInputElement>('td:first-child input:checked'))
      .map(element => parseInt(element.value, 10));
  }

  // This should be fed a response from a JSON request for a paginated collection.
  public updatePagination(response: any): void {
    if (!response.totalPages) {
      return;
    }

    const ul = (new Pagination(response)).generate();

    document.querySelectorAll<HTMLDivElement>('.pagination').forEach((pagination) => {
      pagination.parentNode.replaceChild(ul.cloneNode(true), pagination);
    });
  }

  public checkAll(event?: Event): void {
    const check = event ? (event.target as HTMLInputElement).checked : true;

    this.table.querySelectorAll<HTMLInputElement>('td:first-child input[type=\'checkbox\']').forEach((checkbox) => {
      checkbox.checked = check;
    });
  }

  public uncheckAll(): void {
    this.table.querySelectorAll<HTMLInputElement>('td:first-child input:checked').forEach((input) => {
      input.checked = false;
    });
  }

  public reloadTable(): void {
    // Hook point
  }

  // eslint-disable-next-line no-unused-vars
  public updateRow(row: HTMLTableRowElement, item: any): void {
    // Hook point
  }
}
