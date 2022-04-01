import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { uiFinishLoading, uiStartLoading } from '../../actions/ui';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CardBody from '../ui/CardBody';
import CardHeader from '../ui/CardHeader';
import List from '../ui/List';
import ListItem from '../ui/ListItem';
import PassItem from './PassItem';

function User({}) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) dispatch(uiStartLoading());
    else dispatch(uiFinishLoading());
  }, [user]);

  if (!user) return <></>;

  const role =
    user.role === 'DEV'
      ? 'Desarrollador'
      : user.role === 'ADMIN'
      ? 'Administrador'
      : 'Usuario';

  return (
    <Card classList={['ui-card--shadow', 'py-1']}>
      <CardHeader content='Informacion de Usuario' classList={['mb-1']}>
        {/*         <div className='ui-card__menu'>
          <Button classList={['ui-btn--edit']}>
            <svg>
              <use href='/assets/svg/pencil.svg#pencil'></use>
            </svg>
          </Button>
        </div> */}
      </CardHeader>
      <CardBody>
        {user && (
          <List>
            <ListItem>
              <span className='item-label'>Nombre</span>
              <span className='item-content'>{user.name}</span>
            </ListItem>
            <ListItem>
              <span className='item-label'>Usuario</span>
              <span className='item-content'>{user.user}</span>
            </ListItem>
            <ListItem>
              <span className='item-label'>Rol</span>
              <span className='item-content'>{role}</span>
            </ListItem>
            <PassItem></PassItem>
          </List>
        )}
        {!user && <>Inicie Sesion</>}
      </CardBody>
    </Card>
  );
}

export default User;
