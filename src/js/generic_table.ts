import Pagination from "./components/pagination";
import GenericPage from "./generic_page";
import { elementFromString } from "./utilities";

const sortRows = (rows: HTMLTableRowElement[], sortFunction = () => ()): HTMLTableRowElement[] => {
  const rowsWithSortOrder = rows.map((row) => [sortFunction(row), row]);

  rowsWithSortOrder.sort((x, y) => {
    if (x[0] === y[0]) {
      return 0;
    }

    return x[0] > y[0] ? 1 : -1;
  });

  return rowsWithSortOrder.map((row) => row[1]);
};

export default class GenericTable extends GenericPage {
  private static noRecordsMessage = "No records found.";

  public table: HTMLTableElement;
  public tbody: HTMLTableSectionElement;
  public loadingRow?: HTMLTableRowElement;
  public noRecordsRow?: HTMLTableRowElement;

  constructor(root, table) {
    super(root);

    this.table = table;
    this.tbody = this.table.tBodies[0];
    this.loadingRow = this.tbody.querySelector("tr.loading");
  }

  public initialize() {
    super.initialize();

    this.reloadTable();
  }

  public createRow(item): HTMLTableRowElement {
    const row: HTMLTableRowElement = elementFromString(this.constructor.blankRow);

    this.updateRow(row, item);

    return row;
  }

  public reloadRows(rows: HTMLTableRowElement[], { sort } = { sort: null }): void {
    if (this.loadingRow) {
      this.loadingRow.style.display = "none";
    }

    if (rows) {
      this.tbody.querySelectorAll("tr:not(.no-records):not(.loading)").forEach((row) => {
        row.parentNode.removeChild(row);
      });

      (sort ? sortRows(rows, sort) : rows).forEach((row) => {
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
    row.parentNode.removeChild(row);

    this.updated();
  }

  public updated(): void {
    if (this.tbody.querySelectorAll("tr:not(.no-records):not(.loading)").length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");

      tr.classList.add("no-records");

      td.colSpan = 16;
      td.textContent = this.constructor.noRecordsMessage;

      tr.appendChild(td);
      this.tbody.appendChild(tr);
    }
  }

  public getCheckedIds(): number[] {
    return Array.from(this.tbody.querySelectorAll("td:first-child input:checked"))
      .map(() => parseInt(this.value, 10));
  }

  // This should be fed a response from a JSON request for a paginated
  // collection.
  public updatePagination(response): void {
    if (!response.totalPages) {
      return;
    }

    const paginationHTML = (new Pagination(response)).generate();

    this.root.querySelectorAll(".pagination").forEach((pagination) => {
      pagination.parentNode.replaceChild(ul.cloneNode(true), pagination);
    });
  }

  public checkAll(event: Event): void {
    const check = event ? event.target.checked : true;

    this.table.querySelectorAll("td:first-child input[type=\"checkbox\"]").forEach((checkbox) => {
      checkbox.checked = check;
    });
  }

  public uncheckAll(): void {
    this.table.querySelectorAll("td:first-child input:checked").forEach((input) => {
      input.checked = false;
    });
  }

  public reloadTable(): void {
    // Hook point
  }

  public updateRow(row: HTMLTableRowElement, item): void {
    // Hook point
  }
}