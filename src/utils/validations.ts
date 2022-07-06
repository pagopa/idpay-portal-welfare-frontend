export const validateNumber = (value: string) => {
  const numericValue = parseInt(value, 10);
  if (isNaN(numericValue)) {
    return 'Campo obbligatorio';
  }
  if (numericValue === 0) {
    return 'Immettere un valore positivo';
  }
  return '';
};

export const validateBudget = (totalBudget: string, budgetPerPerson: string) => {
  const numericTotalBudget = parseInt(totalBudget, 10);
  if (isNaN(numericTotalBudget)) {
    return 'Campo obbligatorio';
  }
  if (numericTotalBudget === 0) {
    return 'Immettere un valore positivo';
  }
  const numericBudgetPerPerson = parseInt(budgetPerPerson, 10);
  if (isNaN(numericBudgetPerPerson)) {
    return 'Campo obbligatorio';
  }
  if (numericBudgetPerPerson === 0) {
    return 'Immettere un valore positivo';
  }
  if (numericBudgetPerPerson > numericTotalBudget) {
    return 'Il budget totale deve essere maggiore del budget a persona';
  }
  return '';
};

export const validateString = (value: string) => {
  if (!value.length) {
    return 'Campo obbligatorio';
  }
  return '';
};

// export const validateDateRange = (startDate: string, endDate: string) => {
//   const notEmptyStartDate = validateString(startDate);
//   if (notEmptyStartDate) {
//     return notEmptyStartDate;
//   }
//   const notEmptyEndDate = validateString(endDate);
//   if (notEmptyEndDate) {
//     return notEmptyEndDate;
//   }
//   const startDateObj = new Date(startDate).getTime();
//   const endDateObj = new Date(endDate).getTime();
//   if (startDateObj >= endDateObj) {
//     return 'Date non valide';
//   }
//   return '';
// };

export const validateDateRange = (startDate: Date | null, endDate: Date | null) => {
  if (!startDate || !endDate) {
    return 'Campo obbligatorio';
  }
  if (startDate.getTime() >= endDate.getTime()) {
    return 'La data di inizio deve essere precedente alla data di fine';
  }
  return '';
};

export const validateDipendendDateRanges = (
  parentStartDate: string,
  parentEndDate: string,
  childStartDate: string,
  childEndDate: string
) => {
  const notEmptyParentStartDate = validateString(parentStartDate);
  if (notEmptyParentStartDate) {
    return notEmptyParentStartDate;
  }
  const notEmptyParentEndDate = validateString(parentEndDate);
  if (notEmptyParentEndDate) {
    return notEmptyParentEndDate;
  }
  const notEmptyChildStartDate = validateString(childStartDate);
  if (notEmptyChildStartDate) {
    return notEmptyChildStartDate;
  }
  const notEmptyChildEndDate = validateString(childEndDate);
  if (notEmptyChildEndDate) {
    return notEmptyChildEndDate;
  }

  const parentStartDateObj = new Date(parentStartDate).getTime();
  const parentEndDateObj = new Date(parentEndDate).getTime();
  const childStartDateObj = new Date(childStartDate).getTime();
  const childEndDateObj = new Date(childEndDate).getTime();
  if (
    parentStartDateObj >= parentEndDateObj ||
    parentEndDateObj >= childStartDateObj ||
    childStartDateObj >= childEndDateObj ||
    childEndDateObj <= parentStartDateObj
  ) {
    return 'Date non valide';
  }
  return '';
};
