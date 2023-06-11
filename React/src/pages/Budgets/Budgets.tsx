import { useEffect, useState } from 'react';
import { BudgetService } from '@/services/Budget.service.ts';
import BudgetTile from '@/pages/Budgets/components/BudgetTile/BudgetTile.tsx';
import { BudgetContext } from '@/pages/Budgets/contexts/Budget.context.ts';
import * as _ from 'lodash';

const Budgets = () => {
    const [budgets, setBudgets] = useState<any>([]);

    const handleAddBudget = (newBudget: any, previousPositionBudgetId: any) => {
        const previousBudgetIndex = _.findIndex(budgets, (budget: any)=>{
            return budget.id === previousPositionBudgetId;
        })
        if (previousBudgetIndex < 0) {
            setBudgets([...budgets].push(newBudget));
        }else {
            setBudgets([...budgets, newBudget]);
        }
    }

    const handleDeleteBudget = (deletedBudgetId: any) => {
        const deletedBudgetIndex = _.findIndex(budgets, ['id', deletedBudgetId]);
        if (deletedBudgetIndex >= 0) {
            setBudgets(budgets.filter((budget: any) => budget.id !== deletedBudgetId))
        }
    }

    useEffect(() => {
        BudgetService.getBudgets().then(respondedBudgets => {
            setBudgets(respondedBudgets);
        }).catch(error => {
            console.error('Budgets BudgetService.getBudgets has an error', error);
        });
    }, []);

    return (
        <BudgetContext.Provider value={{budgets, setBudgets}}>
            <section id="vBudget" className="container-with-chart tw-m-4 tw-flex tw-flex-col tw-w-fit lg:tw-flex-row">
                {budgets.map((budget: any) => (
                    <BudgetTile key={budget.id}
                                budget={budget}
                                onAddBudget={handleAddBudget}
                                onDeleteBudget={handleDeleteBudget} />
                ))}
            </section>
        </BudgetContext.Provider>
    )
}

export default Budgets;
