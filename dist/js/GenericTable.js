"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pagination_1 = __importDefault(require("./components/Pagination"));
const GenericPage_1 = __importDefault(require("./GenericPage"));
const utilities_1 = require("./utilities");
const sortRows = (rows, sortFunction) => {
    const rowsWithSortOrder = rows.map(row => [sortFunction(row), row]);
    rowsWithSortOrder.sort((x, y) => {
        if (x[0] === y[0]) {
            return 0;
        }
        return x[0] > y[0] ? 1 : -1;
    });
    return rowsWithSortOrder.map(row => row[1]);
};
class GenericTable extends GenericPage_1.default {
    constructor(table) {
        super();
        this.table = table;
        [this.tbody] = this.table.tBodies;
        this.loadingRow = this.tbody.querySelector('tr.loading');
    }
    initialize() {
        super.initialize();
        this.reloadTable();
    }
    createRow(item) {
        const row = utilities_1.elementFromString(this.constructor.blankRow);
        this.updateRow(row, item);
        return row;
    }
    reloadRows(rows, sort) {
        if (this.loadingRow) {
            this.loadingRow.style.display = 'none';
        }
        if (rows) {
            this.tbody.querySelectorAll('tr:not(.no-records):not(.loading)').forEach((row) => {
                row.remove();
            });
            (sort ? sortRows(rows, sort) : rows).forEach((row) => {
                this.tbody.appendChild(row);
            });
        }
        this.updated();
    }
    addRow(row) {
        this.tbody.appendChild(row);
        this.updated();
    }
    removeRow(row) {
        row.remove();
        this.updated();
    }
    updated() {
        if (this.tbody.querySelectorAll('tr:not(.no-records):not(.loading)').length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            tr.classList.add('no-records');
            td.colSpan = 16;
            td.textContent = this.constructor.noRecordsMessage;
            tr.appendChild(td);
            this.tbody.appendChild(tr);
        }
    }
    getCheckedIds() {
        return Array.from(this.tbody.querySelectorAll('td:first-child input:checked'))
            .map(element => parseInt(element.value, 10));
    }
    // This should be fed a response from a JSON request for a paginated collection.
    updatePagination(response) {
        if (!response.totalPages) {
            return;
        }
        const ul = (new Pagination_1.default(response)).generate();
        document.body.querySelectorAll('[data-pagination]').forEach((container) => {
            const existingPagination = container.querySelector('.pagination');
            if (existingPagination) {
                container.replaceChild(ul.cloneNode(true), existingPagination);
            }
            else {
                container.append(ul.cloneNode(true));
            }
        });
    }
    checkAll(event) {
        const check = event ? event.target.checked : true;
        this.table.querySelectorAll('td:first-child input[type=\'checkbox\']').forEach((checkbox) => {
            checkbox.checked = check;
        });
    }
    uncheckAll() {
        this.table.querySelectorAll('td:first-child input:checked').forEach((input) => {
            input.checked = false;
        });
    }
    reloadTable() {
        // Hook point
    }
    // eslint-disable-next-line no-unused-vars
    updateRow(row, item) {
        // Hook point
    }
}
GenericTable.noRecordsMessage = 'No records found.';
exports.default = GenericTable;
