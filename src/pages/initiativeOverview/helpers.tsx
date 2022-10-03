export const peopleReached = (totalBudget: string, budgetPerPerson: string) => {
  const totalBudgetInt = parseInt(totalBudget, 10);
  const budgetPerPersonInt = parseInt(budgetPerPerson, 10);
  return Math.floor(totalBudgetInt / budgetPerPersonInt);
};
