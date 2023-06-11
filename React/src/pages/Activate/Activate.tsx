import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DjoserService } from '@/services/Djoser.service.ts';
import { ROUTE_PATH } from '@/constants/RoutePath.constant.ts';

enum ACTIVATE_STATUS {
    INIT,
    LOADING,
    SUCCESS,
    FAILED,
}

const Activate = () => {
    const [activateStatus, setActivateStatus] = useState<ACTIVATE_STATUS>(ACTIVATE_STATUS.INIT);
    const { uid } = useParams();
    const { token } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (uid && token) {
            setActivateStatus(ACTIVATE_STATUS.LOADING);
            const data = {
                uid,
                token,
            }
            DjoserService.activateUser(data).then(_ => {
                setActivateStatus(ACTIVATE_STATUS.SUCCESS);
                setTimeout(() => {
                    navigate(`/${ROUTE_PATH.LOGIN}`);
                }, 5000);
            }).catch((error: any) => {
                console.log('Activate DjoserService.activateUser has an error', error);
                setActivateStatus(ACTIVATE_STATUS.FAILED);
            });
        }
    }, []);
    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-md-5 offset-md-4 col-12">
                    <div className="card shadow">
                        <div className="card-header text-center">
                            Activate your account
                        </div>
                        <div className="card-body">
                            {activateStatus === ACTIVATE_STATUS.INIT && (<div>Waiting for Activating?</div>)}
                            {activateStatus === ACTIVATE_STATUS.LOADING && (<div>Activating... please wait!</div>)}
                            {activateStatus === ACTIVATE_STATUS.SUCCESS && (
                                <div>
                                    <div className="alert alert-success">
                                        Your account has been activated. You will be redirect to login page after 5s
                                    </div>
                                </div>
                            )}
                            {activateStatus === ACTIVATE_STATUS.FAILED && (
                                <div>
                                    <div className="alert alert-danger">
                                        Activate failed. This could happen if your token is expired. Please email me (shayinm@gmail.com) for more detail.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Activate;
