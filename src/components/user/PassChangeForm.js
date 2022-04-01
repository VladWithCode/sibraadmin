import React from 'react';
import { useForm } from '../../hooks/useForm';
import Button from '../ui/Button';
import List from '../ui/List';
import ListInputItem from '../ui/ListInputItem';
import ListItem from '../ui/ListItem';

function PassChangeForm({ user, setActiveForm }) {
  const [values, handleInputChange] = useForm({ currentPass: '', newPass: '' });

  const { currentPass, newPass } = values;

  return (
    <List>
      <ListInputItem
        onChange={handleInputChange}
        value={currentPass}
        label='Contraseña actual'
        name='currentPass'
        type='password'
      />
      <ListInputItem
        onChange={handleInputChange}
        value={newPass}
        label='Contraseña nueva'
        name='newPass'
        type='password'
      />
      <ListItem
        classList={['ui-list__item--right', 'ui-list__controls', 'mt-2']}>
        <Button
          classList={['ui-btn--danger']}
          onClick={() => setActiveForm(false)}>
          Cancelar
        </Button>
        <Button classList={['ui-btn--submit']}>Cambiar</Button>
      </ListItem>
    </List>
  );
}

export default PassChangeForm;
