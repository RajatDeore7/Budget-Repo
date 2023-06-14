import { NumberUtil } from '@/utils/Number.util.ts';
import { useEffect, useState } from 'react';
import { BudgetService } from '@/services/Budget.service.ts';
import _ from 'lodash';
import ConfirmationDialog from '@/partials/ConfirmationDialog/ConfirmationDialog.tsx';

import { Dropdown, DropdownButton } from 'react-bootstrap';

type CategoryProps = {
    category: any;
    addCategory?: (category: any) => void;
    updateExpenseCategoryItem?: (updatedCategory: any) => void;
    deleteExpenseCategoryItem?: (deletedCategory: any) => void;
    updateBudgetWhenSaveItem?: (updatedCategory: any) => void;
}

const Category = ({ category,
                      addCategory,
                      updateExpenseCategoryItem,
                      deleteExpenseCategoryItem,
                      updateBudgetWhenSaveItem,
}: CategoryProps) => {
    const [clonedCategory, setClonedCategory] = useState<any>(category);
    const [isCategoryEditing, setCategoryEditing] = useState<boolean>(!clonedCategory.name);
    const [isCategoryRowEditing, setCategoryRowEditing] = useState<boolean>(false);
    const [isItemEditing, setItemEditing] = useState<any>({});
    const [categoryName, setCategoryName] = useState<string>(clonedCategory.name ?? '');
    const [isShownDeleteCategoryConfirmationDialog, setShownDeleteCategoryConfirmationDialog] = useState<boolean>(false);
    const [isShownDeleteItemConfirmationDialog, setShownDeleteItemConfirmationDialog] = useState<boolean>(false);
    const [selectedDeletedItem, setSelectedDeletedItem] = useState<any>({});
    const [itemNames, setItemNames] = useState<any>({});
    const [itemMonthlys, setItemMonthlys] = useState<any>({});
    
    useEffect(() => {
        calculateTotal(category);
        initItemValues(category?.items ?? []);
        // If this category is Expense
        if (category.c_type === 2) {
            calcExpensePercentage(category);
        }
    }, [category]);

    const initItemValues = (items: any[]) => {
        const names: any = {};
        const monthlys: any = {};
        items.forEach((item: any) => {
            names[item.id] = item.name;
            monthlys[item.id] = item.monthly;
        });
        setItemNames(names);
        setItemMonthlys(monthlys);
    }

    const handleEditCategoryButtonClick = () => {
        setCategoryEditing(true);
    }

    const handleSaveCategory = () => {
        if(!categoryName || categoryName=='') return;

        let api;

        const requestCategory = {
            ...category,
        }
        requestCategory.name = categoryName;

        if(typeof category.id =='string' && category.id.indexOf('c_') >= 0) {
            api = BudgetService.postCreateCategory({
                id: undefined,
                ...requestCategory,
            })
        }else {
            api = BudgetService.putUpdateCategory(category.id, {
                ...requestCategory,
            });
        }

        api.then(({data})=> {
            const updatedCategory = {
                ...clonedCategory,
                id: data.id,
                c_type: data.c_type,
                name: data.name,
            };

            if(!updatedCategory?.items?.length) {
                handleAddItem(updatedCategory);
            } else {
                setClonedCategory(updatedCategory);
            }
            if(!updatedCategory.persistent && updateExpenseCategoryItem) {
                updateExpenseCategoryItem(updatedCategory);
            }
            setCategoryEditing(false);
        }).catch((error: any) => {
           console.error('Category > BudgetService.handleSaveCategory has an error', error);
           setCategoryEditing(false);
        });
    }

    const handleDeleteCategory = () => {
        setShownDeleteCategoryConfirmationDialog(true);
    }

    const confirmDeleteCategory = () => {
        if(typeof clonedCategory.id === 'number') {
            BudgetService.deleteCategory(clonedCategory.id)
                .then(()=>{
                    console.log('Category > deleteCategory');
                    if(!clonedCategory.persistent && deleteExpenseCategoryItem) {
                        deleteExpenseCategoryItem(clonedCategory);
                    }
                }).catch((error: any) => {
               console.error('Category > BudgetService.deleteCategory has an error', error);
            });
        } else {
            if(!clonedCategory.persistent && deleteExpenseCategoryItem) {
                deleteExpenseCategoryItem(clonedCategory);
            }
        }
    }

    const itemMoveUp = (item: any) => {
        const index = _.findIndex(category.items,((i: any)=> i.id == item.id));
        if(index<=0) return;
        if(index > category.items.length - 1) return;
        //move
        const tmp = category.items[index];
        category.items[index]= category.items[index - 1];
        category.items[index-1] = tmp
        BudgetService.postItemUp(item.id)
            .then(()=>{
                console.log('Item moved up');
            }).catch((error: any) => {
            console.error('Category > BudgetService.postItemUp has an error', error);
        });
    }

    const itemMoveDown = (item: any) => {
        const index = _.findIndex(category.items,((i: any) => i.id == item.id));
        if(index < 0) return;
        if(index >= category.items.length - 1) return;
        //move
        const tmp = category.items[index]
        category.items[index]= category.items[index + 1];
        category.items[index + 1] = tmp;

        BudgetService.postItemDown(item.id)
            .then(()=>{
                console.log('Item moved down');
            }).catch((error: any) => {
            console.error('Category > BudgetService.postItemDown has an error', error);
        });
    }

    const calculateNet = (updatedItem: any, inputMonthly: number) => {
        const itemIndex = _.findIndex(clonedCategory.items, (item: any) => item.id === updatedItem.id);
        if (itemIndex > -1) {
            const calculatedItem = {
                ...updatedItem,
                bi_weekly: _.round(inputMonthly / 2, 2),
                weekly: _.round(inputMonthly / 4, 2),
                yearly: _.round(inputMonthly * 12, 2),
            }
            const calculatedItems = [...clonedCategory.items];
            calculatedItems[itemIndex] = calculatedItem;
            setClonedCategory({
                ...clonedCategory,
                items: [...calculatedItems],
            })
        }
    }

    const calculateTotal = (category: any) => {
        if (category) {
            const calculatedCategory = {...category};
            calculatedCategory.total_weekly = 0;
            calculatedCategory.total_bi_weekly = 0;
            calculatedCategory.total_monthly = 0;
            calculatedCategory.total_yearly = 0;
            calculatedCategory?.items?.forEach((item: any) => {
                calculatedCategory.total_weekly += item.weekly;
                calculatedCategory.total_bi_weekly += item.bi_weekly;
                calculatedCategory.total_monthly += item.monthly;
                calculatedCategory.total_yearly +=  item.yearly;
            });
            setClonedCategory(calculatedCategory);
        }
    }

    const setZero = (item: any) => {
        setItemMonthlys({
            ...itemMonthlys,
            [item.id]: 0,
        });
        const clonedItem = {...item};
        clonedItem.zero = !clonedItem.zero;
        if(clonedItem.zero) {
            clonedItem.monthly_bak = item.monthly;
            clonedItem.monthly = 0;
        }else {
            clonedItem.monthly = clonedItem.monthly_bak;
        }
        calculateNet(clonedItem, clonedItem.monthly);
        setTimeout(() => {
            if (updateBudgetWhenSaveItem) {
                updateBudgetWhenSaveItem(clonedCategory);
            }
        }, 50);
    }

    const handleAddItem = (inputCategory?: any) => {
        const newCategory = inputCategory ? {...inputCategory} : {...clonedCategory};
        const updatedItems = {...newCategory}.items;
        const newItemId = `i_${Math.random()}`;
        updatedItems.push({
            id: newItemId,
            name: '',
            category: newCategory.id,
            editing: true
        });
        setItemEditing({...isItemEditing, [newItemId]: true});
        setClonedCategory({
            ...newCategory,
            items: updatedItems,
        })
        setCategoryRowEditing(true);
    }

    const handleItemNameChange = (event: any, item: any) => {
        setItemNames({
            ...itemNames,
            [item.id]: event.target.value ?? '',
        });
    }

    const handleItemMonthlyChange = (event: any, item: any) => {
        const inputMonthly = event?.target?.value ?? 0;
        calculateNet(item, inputMonthly);
        setItemMonthlys({
            ...itemMonthlys,
            [item.id]: inputMonthly,
        });
    }

    const handleSaveItem = (item: any) => {
        const inputItemName = itemNames[item.id] ?? '';
        const inputItemMonthly: number = itemMonthlys[item.id] ?? '';
        if(!inputItemName || inputItemName == '' || typeof inputItemMonthly == "undefined") return;
        let api;
        const itemMonthly = _.round(inputItemMonthly, 2);
        const updatedItem = {
            ...item,
            monthly: itemMonthly,
            name: inputItemName,
        };
        if(typeof item.id =='string' && item.id.indexOf('i_') >= 0) { //new
            updatedItem['id'] = undefined;
            api = BudgetService.postCreateItem(updatedItem);
        }else {
            api = BudgetService.putUpdateItem(item.id, updatedItem);
        }
        setItemEditing({
            ...isItemEditing,
            [item.id]: false,
        });
        setCategoryRowEditing(false);
        api.then(({data: respondedItem})=> {
            const updatedCategory = {...clonedCategory};
            const itemIndex = _.findIndex(updatedCategory.items, (findingItem: any) => findingItem.id === item.id);
            updatedCategory.items[itemIndex] = {
                ...updatedItem,
                id: respondedItem.id
            };
            setItemNames({
                ...itemNames,
                [respondedItem.id]: inputItemName,
            });
            setItemMonthlys({
                ...itemMonthlys,
                [respondedItem.id]: inputItemMonthly,
            });
            if (updateBudgetWhenSaveItem) {
                updateBudgetWhenSaveItem(updatedCategory);
            }
            if(clonedCategory.c_type !== 2) {
                setClonedCategory(updatedCategory);
            }
        }).catch((error: any) => {
           console.error('Category > BudgetService.handleSaveItem has an error', error);
        });
    }

    const handleDeleteItemClick = (item: any) => {
        setShownDeleteItemConfirmationDialog(true);
        setSelectedDeletedItem(item);
    }

    const confirmDeleteItem = () => {
        if(typeof selectedDeletedItem.id == 'number') {
            BudgetService.deleteItem(selectedDeletedItem.id)
                .then(()=>{
                    const updatedCategory = {...clonedCategory};
                    updatedCategory.items = updatedCategory.items.filter((item: any) => item.id !== selectedDeletedItem.id);
                    setClonedCategory(updatedCategory);
                    if (updateBudgetWhenSaveItem) {
                        updateBudgetWhenSaveItem(updatedCategory);
                    }
                    setShownDeleteItemConfirmationDialog(false);
                }).catch((error: any) => {
                console.error('Category > confirmDeleteItem has an error', error);
            })
        }
    }

    const handleCategoryNameKeyPress = (event: any) => {
        if (event?.keyCode === 13) {
            handleSaveCategory();
        }
    }

    const handleCategoryNameChange = (event: any) => {
        setCategoryName(event.target.value ?? '');
    }

    const handleItemKeyPress = (event: any, item: any) => {
        if (event?.keyCode === 13) {
            handleSaveItem(item);
        }
    }

    const handleEditItemButtonClick = (itemId: any) => {
        setItemEditing({
            ...isItemEditing,
            [itemId]: true,
        });
        setCategoryRowEditing(true);
    }

    const calcExpensePercentage = (updatedCategory?: any) => {
        const newCategory = updatedCategory ? {...updatedCategory} : {...clonedCategory};
        newCategory.items = newCategory.items.map((item: any) => {
            return {
                ...item,
                percentage: _.round(100 * (item.monthly / newCategory.total_monthly), 2),
            };
        });
        setClonedCategory(newCategory);
    }
    
    //Progress bar
    localStorage.setItem(clonedCategory.name, clonedCategory.total_monthly);

    const handleAddCategory = (selectedOption: any) => {           
        if (addCategory) {
          const newCategory = {
            ...clonedCategory,
            name: selectedOption,
          };          
          addCategory(newCategory);
        //   console.log(clonedCategory);          
        }
      };
    //   console.log(clonedCategory.name);
      
      
    return clonedCategory && (
        <div className="row mb-3">
            <div className="col-12">
                <div className="table-content">
                    <table className="table table-bordered table-centered table-theme-dark">
                        <thead>
                            <tr>
                                <th className="text-left align-top">
                                    {!isCategoryEditing && (
                                        <span>
                                            {clonedCategory.name}
                                        </span>
                                    )}
                                    {isCategoryEditing && (
                                        <input className="form-control"
                                               onKeyDown={handleCategoryNameKeyPress}
                                               onChange={handleCategoryNameChange}
                                               value={categoryName}
                                               autoFocus={true} />
                                    )}
                                </th>
                                <th className="align-top" style={{width: '90px'}}>Weekly</th>
                                <th className="align-top" style={{width: '100px'}}>Bi-Weekly</th>
                                <th className="align-top" style={{width: '100px'}}>Monthly</th>
                                <th className="align-top" style={{width: '100px'}}>Yearly</th>
                                <th no-export="true" className={`align-middle ${isCategoryRowEditing ? 'row-editing' : ''}`} style={{width: isCategoryRowEditing ? '115px' : '70px'}}>
                                    <div className="tw-flex tw-items-center tw-justify-center">
                                        {(!isCategoryEditing && clonedCategory.c_type != 2) && (
                                            <button className="btn btn-sm btn-info btn-tiny tw-mx-0.5"
                                                    onClick={handleEditCategoryButtonClick}>
                                                <i className="material-icons tw-align-text-top tw-text-xl">edit</i>
                                            </button>
                                        )}
                                        {isCategoryEditing && (
                                            <>
                                                <button className="btn btn-sm btn-success btn-tiny tw-mx-0.5" onClick={handleSaveCategory}>
                                                    <i className="material-icons tw-align-text-top tw-text-xl">check</i>
                                                </button>
                                                {!clonedCategory.persistent && (
                                                    <button className="btn btn-sm btn-danger btn-tiny tw-mx-0.5"
                                                            onClick={handleDeleteCategory}>
                                                        <i className="material-icons tw-align-text-top tw-text-xl">delete</i>
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(clonedCategory.items ?? []).map((item: any) => (
                                <tr key={item.id}>
                                    <td className="text-left position-relative">
                                        {!isItemEditing[item.id] && (
                                            <strong>
                                                {item.name}
                                                {item.percentage && (<span> - {item.percentage}%</span>)}
                                            </strong>
                                        )}
                                        {isItemEditing[item.id] && (
                                            <div className="pl-3">
                                                <div className="updown">
                                                    <a href="#"
                                                       className="btn btn-sm btn-tiny btn-info d-block"
                                                       onClick={() => itemMoveUp(item)}>
                                                        <i className="material-icons">expand_less</i>
                                                    </a>
                                                    <a href="#"
                                                       className="btn btn-sm btn-tiny btn-info d-block mt-1"
                                                       onClick={() => itemMoveDown(item)}>
                                                        <i className="material-icons">expand_more</i>
                                                    </a>
                                                </div>
                                                <input className={`form-control ${!item.name ? 'border-danger' : ''}`}
                                                       value={itemNames[item.id]}
                                                       onChange={(event) => handleItemNameChange(event, item)} autoFocus={true} />
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                      <span className="cell weekly">
                                        {NumberUtil.currency(item.weekly)}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="cell biweekly">
                                        {NumberUtil.currency(item.bi_weekly)}
                                      </span>
                                    </td>
                                    <td>
                                        {!isItemEditing[item.id] && (
                                            <span>
                                                <span className="cell monthly">
                                                {NumberUtil.currency(item.monthly)}
                                                </span>
                                            </span>
                                        )}
                                        {isItemEditing[item.id] && (
                                            <input type="number"
                                                   className={`form-control ${item.monthly<=0 || item.monthly==undefined ? 'border-danger' : ''}`}
                                                   value={itemMonthlys[item.id]}
                                                   onKeyDown={(event) => handleItemKeyPress(event, item)}
                                                   onChange={(event) => handleItemMonthlyChange(event, item)} />
                                        )}
                                    </td>
                                    <td>
                                      <span className="cell yearly">
                                        {NumberUtil.currency(item.yearly)}
                                      </span>
                                    </td>
                                    <td no-export="true">
                                        {!item.ref_category && (
                                            <span>
                                                {!isItemEditing[item.id] && (
                                                    <button className="btn btn-sm btn-info btn-tiny"
                                                            onClick={() => handleEditItemButtonClick(item.id)}>
                                                        <i className="material-icons">edit</i>
                                                    </button>
                                                )}
                                                {isItemEditing[item.id] && (
                                                    <span className="tw-flex tw-justify-around tw-items-center">
                                                      <button className={`btn btn-sm btn-tiny ${item.zero ? 'btn-info' : 'btn-outline-info'}`}
                                                              onClick={() => setZero(item)}>
                                                        <i className="material-icons">exposure_zero</i>
                                                      </button>
                                                      <button className="btn btn-sm btn-success btn-tiny" onClick={() => handleSaveItem(item)}>
                                                        <i className="material-icons">check</i>
                                                      </button>
                                                      <button className="btn btn-sm btn-danger btn-tiny" onClick={() => handleDeleteItemClick(item)}>
                                                        <i className="material-icons">delete</i>
                                                      </button>
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td className="text-left"><strong>Total</strong></td>
                                <td><strong>{NumberUtil.currency(clonedCategory.total_weekly)}</strong></td>
                                <td><strong>{NumberUtil.currency(clonedCategory.total_bi_weekly)}</strong></td>
                                <td><strong>{NumberUtil.currency(clonedCategory.total_monthly)}</strong></td>
                                <td><strong>{NumberUtil.currency(clonedCategory.total_yearly)}</strong></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="table-actions text-right tw-flex tw-justify-end">
                {(clonedCategory.c_type === 3 && addCategory) && (
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
                    )}
                    {clonedCategory.name !== 'Expense' && (
                        <button className="btn btn-sm btn-success btn-success-dark tw-flex tw-items-center"
                                onClick={() => handleAddItem()}>
                            <i className="material-icons mr-1">add_circle_outline</i>
                            Row
                        </button>
                    )}
                </div>
            </div>
            <ConfirmationDialog isShown={isShownDeleteCategoryConfirmationDialog}
                                setShown={setShownDeleteCategoryConfirmationDialog}
                                onConfirm={confirmDeleteCategory} />
            <ConfirmationDialog isShown={isShownDeleteItemConfirmationDialog}
                                setShown={setShownDeleteItemConfirmationDialog}
                                onConfirm={confirmDeleteItem} />
        </div>
    );
    
}

export default Category;

