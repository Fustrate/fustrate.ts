import { matches } from './dom';

const toArray = (e: any[] | HTMLFormControlsCollection | NodeListOf<Element>): any[] => Array.prototype.slice.call(e);

// Helper function that returns form elements that match the specified CSS selector
// If form is actually a 'form' element this will return associated elements outside the form that
// have the html form attribute set
export const formElements = (form: HTMLElement, selector: string) => {
  if (form instanceof HTMLFormElement) {
    return toArray(form.elements).filter(el => matches(el, selector));
  }

  return toArray(form.querySelectorAll(selector));
};
