// Function to remove special characters,numbers

export const cleanInputWithSpace = (inp: any) => {
  if (inp) {
    return inp.replace(/[^a-zA-Z ]/g, '');
    // .replace(/\s/g, "");
  }
  return '';
};
//function to remove only special characters
export const cleanInputWithOutSymbol = (inp: any) => {
  if (inp) {
    return inp.replace(/[^a-zA-Z0-9 ]/g, '');
    // .replace(/\s/g, "");
  }
  return '';
};
//function to remove space
export const cleanEmailInput = (inp: any) => {
  if (inp) {
    return inp.replace(/\s/g, '');
  }
  return '';
};
// Function to remove special characters,numbers,space from a string
export const cleanInputWithOutSpace = (inp: any) => {
  if (inp) {
    return inp.replace(/[^a-zA-Z ]/g, '').replace(/\s/g, '');
  }
  return '';
};
//function for only input Number
export const cleanNumberInput = (inp: any) => {
  if (inp) {
    return inp.replace(/(?!-)[^0-9.]/g, '')?.replace('-', '');
  } else {
    return '';
  }
};
//   export default {cleanPersonNameInput,}
export const upperCaseInputWithOutSpace = (inp: any) => {
  if (inp) {
    return inp.replace(/[^A-Z]/g, '').replace(/\s/g, '');
    // .replace(/\s/g, "");
  }
  return '';
};
export const upperCaseInputWithSpace = (inp: any) => {
  if (inp) {
    return inp.replace(/[^A-Z ]/g, '');
    // .replace(/\s/g, "");
  }
  return '';
};
export const cleanAmount = (inp: any) => {
  if (inp) {
    return inp.replace(/(?!-)[^0-9.]/g, '').replace('.00', '');
  }
  return '';
};
export const dateOfBirthRegex = (inp: any) => {
  if (inp) {
    return inp.replace(/[^0-9]/g, '');
  }
  return '';
};
