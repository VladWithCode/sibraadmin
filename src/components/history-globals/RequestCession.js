import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clientSet } from '../../actions/client';
import { floatingButtonSet } from '../../actions/floatingButton';
import { setLot } from '../../actions/lot';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { recordUnset } from '../../actions/record';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import makeServerRequest from '../../helpers/makeServerRequest';
import { redTypes } from '../../types/reduxTypes';
import { ClientShort } from '../clients/ClientShort';
import { Record } from './Record';

export const RequestCession = () => {
  const dispatch = useDispatch();
  const { recordId } = useParams();
  const [loading, setLoading] = useState(true);

  const { client, record, clients } = useSelector(state => state);

  useEffect(() => {
    dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
  }, [dispatch, recordId]);

  const [formValues, setFormValues] = useState({
    requestDate: '',
    assignor: client?.fullName || '',
    assignee: '',
    notes: '',
  });

  const { requestDate, notes, assignor, assignee } = formValues;

  useEffect(() => {
    if (record) {
      setLoading(false);

      const clientFound = clients.find(c => c._id === record.customer);

      if (clientFound) dispatch(clientSet(clientFound));
    }
  }, [record]);

  if (loading) return <>Cargando...</>;

  const inputChange = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const onSubmit = async () => {
    const data = {
      requestDate,
      assignor,
      assignee,
      notes: notes || null,
    };

    dispatch(uiStartLoading());

    const res = await requestCession(data);

    dispatch(uiFinishLoading());

    if (res?.status === 'OK') {
      const modalInfo = {
        title: 'Solicitud realizada con exito',
        text: 'Se ha generado la solicitud de cancelacion correctamente',
        link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
        okMsg: 'Continuar',
        closeMsg: null,
        type: redTypes.project,
      };

      const res = await makeServerRequest('/lots/' + record.lot);

      if (res.status !== 'OK') console.log(res);

      dispatch(setLot(res.lot));
      dispatch(modalUpdate(modalInfo));
      dispatch(modalEnable());
    } else {
      dispatch(
        setTempError(res?.message || 'Hubo un problema con la base de datos')
      );

      return;
    }
  };

  const requestCession = async data => {
    const res = await makeServerRequest(
      `/records/${recordId}/request-cession`,
      'POST',
      { ...data },
      { 'Content-Type': 'application/json' }
    );

    return res;
  };

  const cancel = () => {
    const modalInfo = {
      title: 'Abortar',
      text: '¿Desea abortar la cancelación del expediente?',
      link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
      okMsg: 'Sí',
      closeMsg: 'No',
      type: redTypes.project,
    };

    dispatch(modalUpdate(modalInfo));
    dispatch(modalEnable());
  };

  return (
    <div className='pb-5 project create'>
      <div className='project__header'>
        <div className='left'>
          <h3>Solicitud de Cesión</h3>
        </div>
      </div>

      <div className='card edit my-2'>
        <div className='card__header'>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Solicitar Cesión de Derechos</h4>
        </div>
        <div className='card__body'>
          <div className='left'>
            <div className='card__body__item'>
              <label htmlFor='requestDate'>Fecha de solicitud</label>
              <input
                name='requestDate'
                type='date'
                autoComplete='off'
                value={requestDate}
                onChange={inputChange}
              />
            </div>

            <div className='card__body__item'>
              <label htmlFor='assignor'>Cedente</label>
              <input
                name='assignor'
                type='text'
                autoComplete='off'
                value={assignor}
                onChange={inputChange}
              />
            </div>

            <div className='card__body__item'>
              <label htmlFor='assignee'>Cesionado</label>
              <input
                name='assignee'
                type='text'
                autoComplete='off'
                value={assignee}
                onChange={inputChange}
              />
            </div>

            <div className='card__body__item'>
              <label htmlFor='notes'>Notas</label>
              <textarea name='notes' autoComplete='off' onChange={inputChange}>
                {notes}
              </textarea>
            </div>
          </div>
        </div>
      </div>

      {record._id && <Record record={record} payment={true} />}

      {client && <ClientShort client={client} />}

      <div className='form-buttons'>
        <button className='cancel' onClick={cancel}>
          Cancelar
        </button>
        <button className='next' onClick={onSubmit}>
          Solicitar Cancelación
        </button>
      </div>
    </div>
  );
};