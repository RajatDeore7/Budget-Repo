import { NumberUtil } from '@/utils/Number.util.ts';
import Category from '@/pages/Budgets/components/Category/Category.tsx';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { ChartUtil } from '@/utils/Chart.util.ts';
import { BudgetService } from '@/services/Budget.service.ts';
import EditBudgetDialog from '@/pages/Budgets/components/EditBudgetDialog/EditBudgetDialog.tsx';
import { ExportUtil } from '@/utils/Export.util.ts';

import MyComponent from '../ProgressBar/progress';
import { Dropdown, DropdownButton } from 'react-bootstrap';
type BudgetTileProps = {
    budget: any;
    onAddBudget: (newBudget: any, previousPositionBudgetId: any) => void;
    onDeleteBudget: (deletedBudget: any) => void;
}

const BudgetTile = ({budget, onAddBudget, onDeleteBudget}: BudgetTileProps) => {
    const [clonedBudget, setClonedBudget] = useState<any>(budget);
    const [pieChartOptions, setPieChartOptions] = useState<any>({});
    const [isBudgetEditing, setBudgetEditing] = useState<boolean>(false);

    useEffect(() => {
        ExportUtil.initCsvDownload(
            `first-downloadButton-${clonedBudget.id}`,
            `budgetWrapper-${clonedBudget.id}`,
            `${clonedBudget.name}.csv`,
        );
        ExportUtil.initCsvDownload(
            `second-downloadButton-${clonedBudget.id}`,
            `budgetWrapper-${clonedBudget.id}`,
            `${clonedBudget.name}.csv`,
        );
    }, []);

    useEffect(() => {
        drawChart();
    }, [budget, clonedBudget]);

    const editBudget = () => {
        setBudgetEditing(true);
    }

    const printBudget = () => {
        ExportUtil.print(`budget_tile_${clonedBudget.id}`);
    }

    const printOnlyBudgetTables = () => {
        ExportUtil.print(`budget_table_${clonedBudget.id}`);
    }

    const addBudget = () => {
        BudgetService.copyBudget(budget.id)
            .then(({data: newBudget})=>{
                onAddBudget(newBudget, clonedBudget.id);
            }).catch((error: any) => {
            console.error('BudgetTile > BudgetService.copyBudget has an error', error);
        });
    }

    const handleSaveBudget = (budgetName: string, pieChartTitle: string) => {
        setBudgetEditing(false);
        BudgetService.updateBudget(clonedBudget.id, {
            name: budgetName,
            title: clonedBudget.title,
            pie_title: pieChartTitle,
        }).then(({data}: any) => {
            setClonedBudget({
                ...clonedBudget,
                name: data.name,
                pie_title: data.pie_title,
            });
        }).catch((error: any) => {
            console.error('BudgetTile > BudgetService.updateBudget has an error', error);
        });
    }

    const handleDeleteBudget = () => {
        setBudgetEditing(false);
        BudgetService.deleteBudget(clonedBudget.id).then(() => {
            onDeleteBudget(clonedBudget.id);
        }).catch((error: any) => {
            console.error('BudgetTile > BudgetService.deleteBudget has an error', error);
        });
    }

    const handleAddCategory = (currentCategory?: any) => {
        const newCategory: any = {
            id: `c_${Math.random()}`,
            name: "",
            budget: budget.id,
            editing: true,
            items: []
        }
        const updatedBudget = {...clonedBudget};
        if(!currentCategory) {
            newCategory.order = 1;
            updatedBudget.categories.unshift(newCategory);
        } else {
            newCategory.order = currentCategory.order;
            const index = _.findIndex(clonedBudget.categories, ['id', currentCategory.id])
            if(index < 0) { //add to last
                updatedBudget.categories.push(newCategory);
            }else {
                updatedBudget.categories.splice(index + 1, 0, newCategory);
            }
        }
        setClonedBudget(updatedBudget);
    }
    
    const drawChart = () => {
        const data: any[] = [];
        const totalMonthlyNet = (_.sumBy(clonedBudget.expense.items, 'monthly')) || 0;
        clonedBudget.expense.items.forEach((expenseItem: any) => {
            const monthlyPercentage = _.round(100 * expenseItem.monthly / totalMonthlyNet, 2)
            const monthlyMoney = NumberUtil.currency(_.round(expenseItem.monthly, 2));
            data.push([expenseItem.name, monthlyMoney, monthlyPercentage, `${monthlyPercentage}%`]);
        });
        //format totalMonthlyNet 
        const totalMonthlyNetMoney = NumberUtil.currency(totalMonthlyNet)
        let title = clonedBudget.pie_title;
        if (!title) {
            title = `${clonedBudget.created_by.first_name || clonedBudget.created_by.username}'s Typical<br>Monthly Budget<br>`
        }
        title = `<span style='fill: #fff; font-size: 1.2rem; font-weight: 600;'>${title}<br/><span style='fill: #22c9e4; font-size: 1.6rem; font-weight: 1000;'>${totalMonthlyNetMoney}</span> </span>`

        const subTitle = clonedBudget.title;
        setPieChartOptions(ChartUtil.get3DDonutOptions(data, title, subTitle));
    }

    const updateExpenseCategoryItem = (updatedCategory: any) => {
        const clonedExpenseItems = [...clonedBudget.expense.items];
        const expenseItemIndex = _.findIndex(clonedExpenseItems, ['ref_category', updatedCategory.id]);
        if (expenseItemIndex > -1) {
            clonedExpenseItems[expenseItemIndex].name = updatedCategory.name;
            setClonedBudget({
                ...clonedBudget,
                expense: {
                    ...clonedBudget.expense,
                    items: [...clonedExpenseItems],
                }
            });
        } else {
            const newExpenseItem: any = {
                name: updatedCategory.name,
                ref_category: updatedCategory.id,
                category: clonedBudget.expense.id
            }

            BudgetService.createItem(newExpenseItem)
                .then(({data: createdItem})=>{
                    newExpenseItem.id = createdItem.id;
                    setClonedBudget({
                        ...clonedBudget,
                        expense: {
                            ...clonedBudget.expense,
                            items: [...clonedExpenseItems, newExpenseItem],
                        }
                    });
                });
        }
    }

    const deleteExpenseCategoryItem = (deletedCategory: any) => {
        const clonedExpenseItems = [...clonedBudget.expense.items];
        const expenseItemIndex = _.findIndex(clonedExpenseItems, ['ref_category', deletedCategory.id]);
        if(expenseItemIndex >= 0) {
            clonedExpenseItems.splice(expenseItemIndex, 1)
        }
        const updatedBudgets = {...clonedBudget};
        _.remove(updatedBudgets.categories, ['id', deletedCategory.id]);
        setClonedBudget(updatedBudgets);
    }

    const updateBudgetWhenSaveItem = (category: any) => {
        // Only update Expense when the category is not Income
        if (category.c_type !== 1) {
            const newBudget: any = {...updateRefItem(category)};
            updateRefItemData(category).then(({data: updatedItem}: any)=>{
                const updatedItemIndex = _.findIndex(newBudget.expense.items, (item: any) => item.id === updatedItem.id);
                if (updatedItemIndex > -1) {
                    newBudget.expense.items[updatedItemIndex] = {...updatedItem};
                } else {
                    newBudget.expense.items.push({...updatedItem});
                }
                setClonedBudget({
                    ...newBudget,
                    ...calcSurplus(),
                });
            });
        }
    }
    const calcSurplus = (): any => {
        return {
            surplus_weekly: clonedBudget.income.total_weekly - clonedBudget.expense.total_weekly,
            surplus_bi_weekly: clonedBudget.income.total_bi_weekly - clonedBudget.expense.total_bi_weekly,
            surplus_monthly: clonedBudget.income.total_monthly - clonedBudget.expense.total_monthly,
            surplus_yearly: clonedBudget.income.total_yearly - clonedBudget.expense.total_yearly,
        }
    }

    const updateRefItem = (category: any) => {
        const updatedBudget = {...clonedBudget};
        const itemIndex = _.findIndex(clonedBudget.expense.items, ['ref_category', category.id])
        if(itemIndex > -1) {
            updatedBudget.expense.items[itemIndex].weekly = category.total_weekly;
            updatedBudget.expense.items[itemIndex].bi_weekly = category.total_bi_weekly;
            updatedBudget.expense.items[itemIndex].monthly = category.total_monthly;
            updatedBudget.expense.items[itemIndex].yearly = category.total_yearly;
        }
        return updatedBudget;
    }

    const updateRefItemData = (category: any) => {
        const expenseItem = _.find(clonedBudget.expense.items, ['ref_category', category.id]);
        if(expenseItem) {
            return BudgetService.updateItem(expenseItem.id, expenseItem)
                .catch((error: any) => {
                console.error('BudgetTile > updateItem has an error', error);
            });
        }
        return Promise.resolve({data: {}});
    }
  
    
    return clonedBudget && (
        <>
            <div className="card card-theme-dark shadow budget-container mr-2 printable" id={`budget_tile_${clonedBudget.id}`}>
                <div className="card-header text-center">
                    <strong>{clonedBudget.name}</strong>
                    <span className="float-right tw-flex tw-items-center">
                      <button className="btn btn-info btn-tiny" onClick={editBudget}>
                        <i className="material-icons tw-align-text-top tw-text-xl">edit</i>
                      </button>
                      <button className="btn btn-tiny btn-info tw-ml-1" onClick={printBudget}>
                        <i className="material-icons tw-align-text-top tw-text-xl">print</i>
                      </button>
                      <button className="btn btn-tiny btn-success tw-ml-1" onClick={addBudget}>
                        <i className="material-icons tw-align-text-top tw-text-xl">add_circle_outline</i>
                      </button>
                      <button className="btn btn-tiny btn-info tw-ml-1" id={`first-downloadButton-${clonedBudget.id}`}>
                        <i className="material-icons tw-align-text-top tw-text-xl">file_download</i>
                      </button>
                    </span>
                </div>
                <div className="card-body pl-3 pr-3 pt-2">
                    <section id="chartWarpper">
                        <HighchartsReact highcharts={Highcharts}
                                         containerProps={{style: {height: '500px', backgroundColor : '#3b38d1', marginLeft: '-15px', marginRight: '-15px'}}}
                                         options={pieChartOptions}
                                         isPureConfig={true} />
                    </section>
                </div>
                
                <div id={`budget_table_${clonedBudget.id}`} className="printable">
                    <div className="card-header text-center">
                        <strong>{clonedBudget.name}</strong>
                        <span className="float-right tw-flex tw-items-center">
                      <button className="btn btn-info btn-tiny" onClick={editBudget}>
                        <i className="material-icons tw-align-text-top tw-text-xl">edit</i>
                      </button>
                      <button className="btn btn-tiny btn-info tw-ml-1" onClick={printOnlyBudgetTables}>
                        <i className="material-icons tw-align-text-top tw-text-xl">print</i>
                      </button>
                      <button className="btn btn-tiny btn-success tw-ml-1" onClick={addBudget}>
                        <i className="material-icons tw-align-text-top tw-text-xl">add_circle_outline</i>
                      </button>
                      <button className="btn btn-tiny btn-info tw-ml-1" id={`second-downloadButton-${clonedBudget.id}`}>
                        <i className="material-icons tw-align-text-top tw-text-xl">file_download</i>
                      </button>
                    </span>
                    </div>
                    <div className="card-body pl-3 pr-3 pt-2" id={`budgetWrapper-${clonedBudget.id}`}>
                        <MyComponent />
                        <section id="tableWrapper" className="tw-mt-2">
                            <Category category={clonedBudget.income ?? {}}
                                      addCategory={handleAddCategory}
                                      updateBudgetWhenSaveItem={updateBudgetWhenSaveItem}/>
                            <Category category={clonedBudget.expense ?? {}} />
                            <table className="table table-bordered table-centered font-weight-bold table-theme-light">
                                <tbody>
                                <tr>
                                    <th className="text-left">Surplus / Deficit</th>
                                    <td width="90"
                                        className={`${clonedBudget.surplus_weekly < 0 ? 'text-danger' : 'text-success'}`}>
                                        {NumberUtil.currency(clonedBudget.surplus_weekly)}
                                    </td>
                                    <td width="100" className={`${clonedBudget.surplus_bi_weekly < 0 ? 'text-danger' : 'text-success'}`}>
                                        {NumberUtil.currency(clonedBudget.surplus_bi_weekly)}
                                    </td>
                                    <td width="100" className={`${clonedBudget.surplus_monthly < 0 ? 'text-danger' : 'text-success'}`}>
                                        {NumberUtil.currency(clonedBudget.surplus_monthly)}
                                    </td>
                                    <td width="100" className={`${clonedBudget.surplus_yearly < 0 ? 'text-danger' : 'text-success'}`}>
                                        {NumberUtil.currency(clonedBudget.surplus_yearly)}
                                    </td>
                                    <td className="" width="75"></td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="table-actions text-right">
                                <div className="d-flex justify-content-end pb-3">
                                    <DropdownButton
                                        className="btn-success-darkbtn-success-dark mr-2 tw-flex tw-items-center"
                                        title="Category"
                                        id="category-dropdown">
                                        <Dropdown.Item onClick={() => handleAddCategory('Income')}>
                                            Income
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Mortage')}>
                                            Mortage
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Property Tax')}>
                                            Property Tax
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Condo Fee')}>
                                            Condo Fee
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Heating')}>
                                            Heating
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Home Insurance')}>
                                            Home Insurance
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Personal Insurance')}>
                                            Personal Insurance
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Investment')}>
                                            Investment
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Loans')}>
                                            Loans
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleAddCategory('Groceries')}>
                                            Groceries
                                        </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleAddCategory('Other')}>
                                            Other
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </div>
                            {clonedBudget.categories.length > 0 && (
                                <div>
                                    {clonedBudget.categories.map((category: any) => (
                                        <Category key={category.id}
                                                  category={category ?? {}}
                                                  addCategory={handleAddCategory}
                                                  updateExpenseCategoryItem={updateExpenseCategoryItem}
                                                  deleteExpenseCategoryItem={deleteExpenseCategoryItem}
                                                  updateBudgetWhenSaveItem={updateBudgetWhenSaveItem}/>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                    <div className="card-footer">
                    </div>
                </div>
                <EditBudgetDialog budget={clonedBudget}
                                  isEditing={isBudgetEditing}
                                  setEditing={setBudgetEditing}
                                  saveBudget={handleSaveBudget}
                                  deleteBudget={handleDeleteBudget} />
            </div>
        </>
    )
}

export default BudgetTile;
