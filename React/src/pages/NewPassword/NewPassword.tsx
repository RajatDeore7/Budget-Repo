import { Button, Form } from 'react-bootstrap';
import classes from './NewPassword.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import { values } from 'lodash';
import { ROUTE_PATH } from '@/constants/RoutePath.constant.ts';


export const NewPassword = () => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const { token } = useParams();

  const [error, setError] = useState<any>(null);
  const [logging, setLogging] = useState<boolean>(false);
  const auth = useAuth();
  const submit = async (e: any) => {
    e.preventDefault();
    setError(null);
    setLogging(true);

    if( e.target.password.value !== e.target.rpassword.value){
      toast.error('Password not match');
      setLogging(false);
      return
    }

    const data = {
      new_password: e.target.password.value,
      uid: uid,
      token:token
    }
    try {
      await auth.newPassword(data);
      toast("Successfully!");
      navigate(`/${ROUTE_PATH.LOGIN}`);
    } catch (e) {
      setError(e);
    }
    finally {
      setLogging(false)
    }
  }
  return <div className={`tw-container tw-mx-auto tw-flex tw-items-center tw-justify-center md:tw-h-screen tw-my-32 md:tw-my-0 ${classes.wrapper}`}>
    <div className="tw-w-2/3">
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-16">

        <div className={`${classes.loginBlock} tw-shadow-lg tw-shadow-slate-700/50`}>
          <div className="tw-text-center tw-py-3 tw-bg-slate-100 tw-border-b-slate-300 tw-border-b tw-border-b-solid">
            New Password
          </div>
          <div className="tw-p-12">
            <form onSubmit={submit}>
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2">
                <div>
                  <Form.Label htmlFor="password">New Password<span className='tw-text-red-500'>*</span></Form.Label>
                  <Form.Control id="password" type="password" required></Form.Control>
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-2">
                <div>
                  <Form.Label htmlFor="rpassword">Repeat New Password<span className='tw-text-red-500'>*</span></Form.Label>
                  <Form.Control id="rpassword" type="password" required></Form.Control>
                </div>
              </div>
              <div className="tw-bg-red-100 tw-border tw-border-red-400 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded tw-relative tw-mt-5" role="alert" hidden={!error}>
                <span className="tw-block sm:tw-inline">{values(error?.response?.data)?.[0]?.[0]}</span>
              </div>
              <div className="tw-flex tw-items-center tw-justify-between tw-mt-4">

                <Button type="submit" variant='success' disabled={logging} className='!tw-flex tw-items-center tw-justify-center'>
                  {logging ?
                      <FontAwesomeIcon icon={faCircleNotch} className='tw-mr-2 fa-spin' /> :
                      <span className="material-symbols-outlined tw-mr-2">
                      app_registration
                    </span>}
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
}

