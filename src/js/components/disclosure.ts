import Component from "../component";
import { delegate } from "../rails/utils/event";
import { triggerEvent } from "../utilities";

export default class Disclosure extends Component {
  public static initialize() {
    delegate(document.body, ".disclosure-title", "click", this.toggleDisclosure);
  }

  public static toggleDisclosure(event) {
    const disclosure = event.target.closest(".disclosure");
    const isOpen = disclosure.classList.contains("open");

    disclosure.classList.toggle("open");

    triggerEvent(disclosure, `${(isOpen ? "closed" : "opened")}.disclosure`);

    return false;
  }
}
