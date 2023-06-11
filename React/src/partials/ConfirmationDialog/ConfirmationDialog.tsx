import { Dispatch, SetStateAction } from 'react';

type ConfirmationDialogProps = {
    isShown: boolean;
    setShown: Dispatch<SetStateAction<boolean>>;
    onConfirm: any;
    options?: any;
}

const ConfirmationDialog = ({onConfirm, isShown, setShown, options = {
    title: 'Delete Confirm',
    content: 'Do you want to delete this?',
    confirmBtnClass: 'btn-danger',
    confirmBtnIcon: 'delete',
    confirmBtn: 'Delete'
}}: ConfirmationDialogProps) => {

    const handleCloseButtonClick = () => {
        setShown(false);
    }

    const handleConfirmButtonClick = () => {
        onConfirm();
    }

    return isShown ? (
        <div>
            <div className="modal d-block">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{options.title}</h5>
                            <button type="button" className="close" onClick={handleCloseButtonClick}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{options.content}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseButtonClick}>Close</button>
                            <button type="button" className={`btn ${options.confirmBtnClass}`}
                                    onClick={handleConfirmButtonClick}>
                                <i className="material-icons">{options.confirmBtnIcon}</i>
                                {options.confirmBtn}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </div>
    ) : <></>;
}

export default ConfirmationDialog;
