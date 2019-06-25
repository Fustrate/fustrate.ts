import TooltipJS from "tooltip.js";
import Component from "../component";

export default class Tooltip extends Component {
  public static create(node: HTMLElement, title: string, { placement, container } = {}): TooltipJS {
    return new TooltipJS(node, {
      container: container === undefined ? document.body : container,
      placement: placement || "bottom",
      title,
    });
  }
}
