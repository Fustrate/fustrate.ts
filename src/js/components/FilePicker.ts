import Component from '../Component';

// Turn any element into a trigger for file selection.
export default class FilePicker extends Component {
  constructor(callback: (files: File[]) => void) {
    super();

    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    input.addEventListener('change', () => {
      const files: File[] = [];

      if (input.files) {
        for (let i = 0, l = input.files.length; i < l; i += 1) {
          if (input.files[i]) {
            files.push(input.files[i]);
          }
        }
      }

      callback(files);

      input.remove();
    });

    document.body.appendChild(input);

    input.click();
  }
}
