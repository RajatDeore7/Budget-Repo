import { useState } from 'react';

type EditBudgetDialogProps = {
    budget: any;
    isEditing: boolean;
    setEditing: (isEditing: boolean) => void;
    saveBudget: (budgetName: string, pieChartTitle: string) => void;
    deleteBudget: (budget: any) => void;
}

const EditBudgetDialog = (
    {
        budget,
        isEditing,
        setEditing,
        saveBudget,
        deleteBudget,
    }: EditBudgetDialogProps
) => {
    const [budgetName, setBudgetName] = useState<string>(budget?.name ?? '');
    const [pieChartTitle, setPieChartTitle] = useState<string>(budget?.pie_title ?? '');

    const handleBudgetNameChange = (event: any) => {
        setBudgetName(event?.target?.value ?? '');
    }

    const handlePieChartTitleChange = (event: any) => {
        setPieChartTitle(event?.target?.value ?? '');
    }

    return isEditing ? (
        <div className="modal d-block">
            <div className="modal-dialog">
                <div className="modal-content">
                    <form onSubmit={() => saveBudget(budgetName, pieChartTitle)}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Budget</h5>
                            <button type="button" className="close" onClick={() => setEditing(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">Budget Name</label>
                                <div className="col-sm-9">
                                    <input type="text"
                                           className="form-control"
                                           value={budgetName}
                                           onChange={handleBudgetNameChange} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-3 col-form-label">Pie Chart Title</label>
                                <div className="col-sm-9">
                                    <input type="text"
                                           className="form-control"
                                           value={pieChartTitle}
                                           onChange={handlePieChartTitleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger mr-auto"
                                    onClick={() => deleteBudget(budget)}>
                                <i className="material-icons">delete</i>
                                Delete
                            </button>
                            <button type="button" className="btn btn-secondary"
                                    onClick={() => setEditing(false)}>Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="material-icons">check</i>
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    ) : <></>;
}

export default EditBudgetDialog;
