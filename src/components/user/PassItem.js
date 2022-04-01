import React, { useEffect, useState } from 'react';
import ListItem from '../ui/ListItem';
import PassChangeForm from './PassChangeForm';

function PassItem({ user }) {
  const [activeForm, setActiveForm] = useState(false);

  return (
    <ListItem>
      {activeForm ? (
        <PassChangeForm user={user} setActiveForm={setActiveForm} />
      ) : (
        <>
          <span className='item-label'>Contraseña</span>
          <span
            className='item-content item-content--action'
            onClick={() => setActiveForm(true)}>
            Cambiar
          </span>
        </>
      )}
    </ListItem>
  );
}

export default PassItem;
