import { createContext, useContext } from 'react';

export type BudgetContextProp = {
    budgets: any,
    setBudgets: (budget: any) => void,
}

export const BudgetContext = createContext<BudgetContextProp>({
    budgets: [],
    setBudgets: () => { return; },
})

export const useBudgetContext = () => useContext(BudgetContext);
