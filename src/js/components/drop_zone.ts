import Component from '../component';
import { stopEverything } from '../rails/utils/event';

// Allow files to be dropped onto an element
export default class DropZone extends Component {
  public static create(target: HTMLElement, callback: (files: File[]) => void) {
    return new DropZone(target, callback);
  }

  constructor(target: HTMLElement, callback: (files: File[]) => void) {
    super();

    target.addEventListener('dragover', stopEverything);
    target.addEventListener('dragenter', stopEverything);

    target.addEventListener('drop', (event: DragEvent) => {
      stopEverything(event);

      const files: File[] = [];

      if (event.dataTransfer && event.dataTransfer.files) {
        for (let i = 0, l = event.dataTransfer.files.length; i < l; i += 1) {
          if (event.dataTransfer.files[i]) {
            files.push(event.dataTransfer.files[i]);
          }
        }
      }

      callback(files);
    });
  }
}
