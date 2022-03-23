import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { recordSet } from '../../actions/record';
import {
  setSuccessNotice,
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import makeServerRequest from '../../helpers/makeServerRequest';
import { Floating } from '../Floating';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CardBody from '../ui/CardBody';
import CardHeader from '../ui/CardHeader';
import List from '../ui/List';
import ListItem from '../ui/ListItem';
import AddNote from './AddNote';
import EditNote from './EditNote';

function RecordNotes({ notes, recordId }) {
  const dispatch = useDispatch();
  const [activeAddNote, setActiveAddNote] = useState(false);
  const [activeEditNote, setActiveEditNote] = useState(false);
  const [editNote, setEditNote] = useState('');

  const handleUpdateClick = async note => {
    setEditNote(note);
    setActiveEditNote(true);
  };

  const handleDeleteClick = async note => {
    dispatch(uiStartLoading());
    const { status, record, message, error } = await makeServerRequest(
      `/records/${recordId}/notes`,
      'DELETE',
      { note },
      { 'Content-Type': 'application/json' }
    );
    dispatch(uiFinishLoading());

    if (status !== 'OK') {
      console.log(error);
      dispatch(
        setTempError(error?.message || message || 'Error al eliminar nota')
      );
      return;
    }

    dispatch(recordSet(record));
    dispatch(setSuccessNotice('Se elimino la nota exitosamente'));
  };

  return (
    <div className='recordNotes'>
      <Card>
        <CardHeader content={'Notas'}>
          <div className='ui-card__controls'>
            <Button
              onClick={() => setActiveAddNote(true)}
              children={'Añadir nota'}
            />
          </div>
        </CardHeader>
        <CardBody classList={['ui-card__body--scroll']}>
          <List classList={['w-100p', 'mt-2']}>
            {notes?.map((n, i) => (
              <ListItem
                key={n + i}
                classList={[
                  'ui-list__item--flex',
                  'pl-2',
                  i > 0 ? 'mt-1' : '',
                ]}>
                <div className='content text-black'>{n}</div>
                <div className='update' onClick={() => handleUpdateClick(n)}>
                  <svg>
                    <use href='../assets/svg/pencil.svg#pencil'></use>
                  </svg>
                </div>
                <div className='delete' onClick={() => handleDeleteClick(n)}>
                  <svg viewBox='0 0 32 32'>
                    <use href='../assets/svg/bin.svg#bin'></use>
                  </svg>
                </div>
              </ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
      {activeAddNote && (
        <Floating setActiveFloating={setActiveAddNote}>
          <AddNote recordId={recordId} setActiveFloating={setActiveAddNote} />
        </Floating>
      )}
      {activeEditNote && (
        <Floating setActiveFloating={setActiveEditNote}>
          <EditNote
            note={editNote}
            recordId={recordId}
            setActiveFloating={setActiveEditNote}
          />
        </Floating>
      )}
    </div>
  );
}

export default RecordNotes;

/* <>
      <div className='card__header'>
        <h4>Notas</h4>
      </div>
      <div className='card__body'>
        <List>
          <ListItem>Nota ejemplo</ListItem>
        </List>
      </div>
    </> */
