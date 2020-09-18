// A few select tags that we're most likely to show or hide
const defaultDisplayMap: { [k: string]: string } = {
  A: 'inline',
  BUTTON: 'inline',
  DIV: 'block',
  FORM: 'block',
  IMG: 'inline',
  INPUT: 'inline',
  LABEL: 'inline',
  P: 'block',
  PRE: 'block',
  SECTION: 'block',
  SELECT: 'inline',
  SPAN: 'inline',
  TABLE: 'block',
  TEXTAREA: 'inline',
};

function getDefaultDisplay(element: HTMLElement) {
  const { nodeName } = element;
  let display = defaultDisplayMap[nodeName];

  if (display) {
    return display;
  }

  const { ownerDocument } = element;

  const temp = ownerDocument.body.appendChild(ownerDocument.createElement(nodeName));
  ({ display } = temp.style);

  temp.parentNode?.removeChild(temp);

  if (display === 'none') {
    display = 'block';
  }

  defaultDisplayMap[nodeName] = display;

  return display;
}

function toggleElement(element: HTMLElement, makeVisible?: boolean) {
  if (makeVisible == null) {
    makeVisible = element.style.display === 'none';
  }

  element.style.display = makeVisible ? getDefaultDisplay(element) : 'none';

  if (makeVisible) {
    element.classList.remove('js-hide');
  }
}

export const isVisible = (elem: HTMLElement): boolean => !!(
  elem.offsetWidth
  || elem.offsetHeight
  || elem.getClientRects().length
);

export const toggle = (element: NodeListOf<HTMLElement> | HTMLElement, showOrHide?: boolean): void => {
  if (element instanceof NodeList) {
    element.forEach((elem) => {
      toggleElement(elem, showOrHide !== undefined ? showOrHide : !isVisible(elem));
    });
  } else {
    toggleElement(element, showOrHide !== undefined ? showOrHide : !isVisible(element));
  }
};

export const show = (element: HTMLElement): void => {
  toggle(element, true);
};

export const hide = (element: HTMLElement): void => {
  toggle(element, false);
};
