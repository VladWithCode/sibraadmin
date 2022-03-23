import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { recordSet } from '../../actions/record';
import {
  setTempError,
  setTempSuccessNotice,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import makeServerRequest from '../../helpers/makeServerRequest';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CardBody from '../ui/CardBody';
import CardHeader from '../ui/CardHeader';
import List from '../ui/List';
import ListInputItem from '../ui/ListInputItem';
import ListItem from '../ui/ListItem';

function EditCheck({ check, recordId, setActiveFloating }) {
  const dispatch = useDispatch();
  const [newCheck, setNewCheck] = useState(check);

  const submitNote = async () => {
    dispatch(uiStartLoading());
    const { status, record, message, error } = await makeServerRequest(
      '/records/' + recordId + '/checks',
      'PUT',
      { check: newCheck },
      { 'Content-Type': 'application/json' }
    );
    dispatch(uiFinishLoading());

    if (status !== 'OK') {
      console.log(error);
      dispatch(
        setTempError(
          message ||
            error?.message ||
            'Hubo un error al conectarse con la base de datos'
        )
      );
      return;
    }

    dispatch(recordSet(record));
    dispatch(setTempSuccessNotice('Edición realizada con exito'));
    setActiveFloating(false);
  };

  return (
    <div className='addNote'>
      <Card>
        <CardHeader classList={['mb-2']} content={'Editar Nota'} />
        <CardBody>
          <List classList={['pl-2', 'pr-2', 'w-100p']}>
            <ListItem classList={['pl-1', 'mb-1']}>{check.content}</ListItem>
            <ListInputItem
              classList={['mb-2']}
              label={'Contenido'}
              name={'note'}
              value={newCheck.content}
              onChange={({ target }) =>
                setNewCheck({ ...newCheck, content: target.value })
              }
            />
            <Button onClick={submitNote}>Guardar</Button>
          </List>
        </CardBody>
      </Card>
    </div>
  );
}

export default EditCheck;
