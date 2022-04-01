import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { authSet, roleSet, userSet } from '../../actions/auth';
import {
  setSuccessNotice,
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import AuthService from '../../services/AuthService';
import ScreenBody from '../screen/ScreenBody';
import ScreenHeader from '../screen/ScreenHeader';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CardBody from '../ui/CardBody';
import CardHeader from '../ui/CardHeader';
import List from '../ui/List';
import ListInputItem from '../ui/ListInputItem';
import ListItem from '../ui/ListItem';

function SignIn() {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  const [formValues, handleInputChange] = useForm({ user: '', pass: '' });
  const history = useHistory();

  const { user, pass } = formValues;

  useEffect(() => {
    if (isAuth) history.push('/usuario');
  }, [isAuth]);

  const signin = async () => {
    dispatch(uiStartLoading());
    const [u, info] = await AuthService.signin(user, pass);
    dispatch(uiFinishLoading());

    if (!u) {
      console.log(info);
      dispatch(
        setTempError(
          info.message || info.error?.message || 'Error al iniciar sesión'
        )
      );
      return;
    }

    dispatch(authSet(true));
    dispatch(userSet(u));
    dispatch(roleSet(u.role));
    dispatch(setSuccessNotice('Inicio exitoso. Bienvenido(a) ' + u.name));
    history.push('/usuario');
  };

  return (
    <div className='SignIn ui-screen'>
      <ScreenHeader heading={'Iniciar Sesión'} />
      <ScreenBody>
        <Card classList={['SignIn__form', 'py-1']}>
          <CardHeader content={'Iniciar sesión'} classList={['mb-1']} />
          <CardBody>
            <List>
              <ListInputItem
                classList={['ui-listinput--col']}
                label={'Usuario'}
                name='user'
                onChange={handleInputChange}
                value={user}
              />
              <ListInputItem
                classList={['ui-listinput--col']}
                label={'Contraseña'}
                name='pass'
                type='password'
                onChange={handleInputChange}
                value={pass}
              />
              <ListItem classList={['ui-list__item--flex', 'mt-auto']}>
                <Button onClick={signin}>Iniciar</Button>
              </ListItem>
            </List>
          </CardBody>
        </Card>
      </ScreenBody>
    </div>
  );
}

export default SignIn;
