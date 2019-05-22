export const compact = (array, strings = true) => {
  array.forEach((el, index) => {
    if (!(el === undefined || el === null || (strings && el === ''))) {
      return;
    }

    array.splice(index, 1);
  });

  return array;
};

export const first = array => array[0];

export const last = array => array[array.length - 1];

export const remove = (array, object) => {
  const index = array.indexOf(object);

  if (index !== -1) {
    array.splice(index, 1);
  }
};

export const toSentence = (array) => {
  switch (array.length) {
    case 0:
      return '';
    case 1:
      return array[0];
    case 2:
      return `${array[0]} and ${array[1]}`;
    default:
      return `${array.slice(0, -1).join(', ')}, and ${array[array.length - 1]}`;
  }
};
