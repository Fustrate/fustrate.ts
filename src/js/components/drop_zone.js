import Component from '../component';

// Allow files to be dropped onto an element
export default class DropZone extends Component {
  constructor(target, callback) {
    super();

    target.addEventListener('dragover', false);
    target.addEventListener('dragenter', false);
    target.addEventListener('drop', (event) => {
      callback(event.dataTransfer.files);

      return false;
    });
  }
}
