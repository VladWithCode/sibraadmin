import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  setSuccessNotice,
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import { useAuth } from '../../hooks/useAuth';
import AuthService from '../../services/AuthService';
import ScreenBody from '../screen/ScreenBody';
import ScreenHeader from '../screen/ScreenHeader';
import Button from '../ui/Button';
import Card from '../ui/Card';
import User from './User';

function Profile() {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (!isAuth) history.push('/iniciar');
  }, [isAuth]);

  const signout = async () => {
    dispatch(uiStartLoading());
    const [message, error] = await AuthService.signout();
    dispatch(uiFinishLoading());

    if (error) {
      dispatch(
        setTempError(
          error.message || message || 'Hubo un error al cerrar sesión'
        )
      );
      return;
    }

    dispatch(setSuccessNotice(message));
    history.push('/iniciar');
  };

  return (
    <div className='Profile ui-screen'>
      <ScreenHeader heading={'Perfil de usuario'}>
        <div className='ui-screen__menu'>
          <Button onClick={signout} classList={['ui-btn--danger']}>
            Cerrar Sesión
          </Button>
        </div>
      </ScreenHeader>
      <ScreenBody classList={['Profile-body']}>
        <div className='Profile-user row-span__2'>
          <User />
        </div>
        <div className='Profile-user'></div>
        <div className='Profile-user'></div>
      </ScreenBody>
    </div>
  );
}

export default Profile;
