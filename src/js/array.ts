export const compact = <T>(arr: Array<T | string>, strings: boolean = true): Array<T | string> => {
  arr.forEach((el, index) => {
    if (!(el === undefined || el === null || (strings && el === ""))) {
      return;
    }

    arr.splice(index, 1);
  });

  return arr;
};

export const first = <T>(arr: T[]): T | undefined => arr[0];

export const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];

export const remove = <T>(arr: T[], object: T) => {
  const index = arr.indexOf(object);

  if (index !== -1) {
    arr.splice(index, 1);
  }
};

export const toSentence = (arr: string[]) => {
  switch (arr.length) {
    case 0:
      return "";
    case 1:
      return arr[0];
    case 2:
      return `${arr[0]} and ${arr[1]}`;
    default:
      return `${arr.slice(0, -1).join(", ")}, and ${arr[arr.length - 1]}`;
  }
};
