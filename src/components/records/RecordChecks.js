import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import CheckListItem from '../ui/CheckListItem';
import List from '../ui/List';
import AddCheck from './AddCheck';
import EditCheck from './EditCheck';

function RecordChecks({ checks }) {
  const dispatch = useDispatch();
  const record = useSelector(state => state.record);
  const [activeAddCheck, setActiveAddCheck] = useState(false);
  const [activeEditCheck, setActiveEditCheck] = useState(false);
  const [editCheck, setEditCheck] = useState(null);

  const handleUpdateClick = async check => {
    setEditCheck(check);
    setActiveEditCheck(true);
  };

  const handleDeleteClick = async check => {
    dispatch(uiStartLoading());
    const {
      status,
      record: r,
      message,
      error,
    } = await makeServerRequest(
      `/records/${record._id}/checks`,
      'DELETE',
      { check },
      { 'Content-Type': 'application/json' }
    );
    dispatch(uiFinishLoading());

    if (status !== 'OK') {
      console.log(error);
      dispatch(setTempError(error?.message || message || 'Error al eliminar'));
      return;
    }

    dispatch(recordSet(r));
    dispatch(setSuccessNotice('Se eliminó check exitosamente'));
  };

  const handleCheckboxClick = async check => {
    dispatch(uiStartLoading());
    const {
      status,
      record: r,
      message,
      error,
    } = await makeServerRequest(
      `/records/${record._id}/checks`,
      'PUT',
      { check: { ...check, checked: !check.checked } },
      { 'Content-Type': 'application/json' }
    );
    dispatch(uiFinishLoading());

    if (status !== 'OK') {
      console.log(error);
      dispatch(setTempError(error?.message || message || 'Error al eliminar'));
      return;
    }

    dispatch(recordSet(r));
  };

  return (
    <div className='recordNotes'>
      <Card>
        <CardHeader content={'Checklist'}>
          <div className='ui-card__controls'>
            <Button
              children={'Añadir'}
              onClick={() => setActiveAddCheck(true)}
            />
          </div>
        </CardHeader>
        <CardBody>
          <List classList={['w-100p', 'mt-2']}>
            {checks?.map(c => {
              console.log(c);
              return (
                <CheckListItem
                  content={c.content}
                  checked={c.checked}
                  key={c._id}
                  classList={['ui-list__item--flex', 'pl-2']}
                  handleCheckboxClick={() => handleCheckboxClick(c)}>
                  <div className='update' onClick={() => handleUpdateClick(c)}>
                    <svg>
                      <use href='../assets/svg/pencil.svg#pencil'></use>
                    </svg>
                  </div>
                  <div className='delete' onClick={() => handleDeleteClick(c)}>
                    <svg viewBox='0 0 32 32'>
                      <use href='../assets/svg/bin.svg#bin'></use>
                    </svg>
                  </div>
                </CheckListItem>
              );
            })}
          </List>
        </CardBody>
      </Card>
      {activeAddCheck && (
        <Floating setActiveFloating={setActiveAddCheck}>
          <AddCheck
            setActiveFloating={setActiveAddCheck}
            recordId={record._id}
          />
        </Floating>
      )}
      {activeEditCheck && (
        <Floating setActiveFloating={setActiveEditCheck}>
          <EditCheck
            setActiveFloating={setActiveEditCheck}
            recordId={record._id}
            check={editCheck}
          />
        </Floating>
      )}
    </div>
  );
}

export default RecordChecks;
