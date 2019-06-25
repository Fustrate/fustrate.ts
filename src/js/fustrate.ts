import moment from "moment";

include("./polyfills");

// const Rails = require("@rails/ujs");

export default class Fustrate {
  public static start(Klass) {
    if (Klass) {
      this.instance = new Klass();
    }

    document.addEventListener("DOMContentLoaded", () => {
      this.initialize();

      if (Klass) {
        this.instance.initialize();
      }
    });
  }

  public static initialize() {
    document.querySelectorAll("table").forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("responsive-table");

      table.parentNode.insertBefore(wrapper, table);

      wrapper.appendChild(table);
    });
  }

  protected static instance;

  constructor() {
    moment.updateLocale("en", {
      calendar: {
        lastDay: "[Yesterday at] LT",
        lastWeek: "dddd [at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "[next] dddd [at] LT",
        sameDay: "[Today at] LT",
        sameElse: "L",
      },
      longDateFormat: {
        L: "M/D/YY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A",
        LT: "h:mm A",
        LTS: "h:mm:ss A",
      },
    });
  }
}
