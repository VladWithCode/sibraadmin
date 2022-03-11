import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clientSet } from '../../actions/client';
import { floatingButtonSet } from '../../actions/floatingButton';
import { setLot } from '../../actions/lot';
import { modalEnable, modalUpdate } from '../../actions/modal';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import makeServerRequest from '../../helpers/makeServerRequest';
import { redTypes } from '../../types/reduxTypes';
import { ClientShort } from '../clients/ClientShort';
import { Record } from './Record';

const CompleteCession = () => {
  const dispatch = useDispatch();
  const { recordId } = useParams();
  const [loading, setLoading] = useState(true);

  const { client, record, clients, lots, lot } = useSelector(state => state);

  useEffect(() => {
    dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
  }, [dispatch, recordId]);

  const [formValues, setFormValues] = useState({
    cessionDate: '',
    assignor: client?.fullName || '',
    assignee: '',
    notes:
      lot?.cessions.find(c => c._id === record.activeCessionId)?.notes || '',
  });

  const { cessionDate, notes } = formValues;

  useEffect(() => {
    if (record) {
      setLoading(false);

      const clientFound = clients.find(c => c._id === record.customer);
      const lotFound = lots.find(l => l._id === record.lot);

      if (clientFound) dispatch(clientSet(clientFound));
      if (lotFound) dispatch(setLot(lotFound));
    }
  }, [record, clients, lots, dispatch]);

  if (loading) return <>Cargando...</>;

  const inputChange = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const onSubmit = async () => {
    const data = {
      cessionDate,
      notes: notes || null,
    };

    dispatch(uiStartLoading());

    const res = await completeCession(data);

    dispatch(uiFinishLoading());

    if (res?.status === 'OK') {
      const modalInfo = {
        title: 'Cesión exitosa',
        text: 'Se ha realizado la cesión correctamente',
        link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
        okMsg: 'Continuar',
        closeMsg: null,
        type: redTypes.project,
      };

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

  const completeCession = async data => {
    const res = await makeServerRequest(
      `/records/${recordId}/complete-cession`,
      'POST',
      { ...data },
      { 'Content-Type': 'application/json' }
    );

    return res;
  };

  const cancelCession = async () => {
    dispatch(uiStartLoading());
    const res = await makeServerRequest(
      `/records/${recordId}/cancel-cession`,
      'DELETE'
    );

    dispatch(uiFinishLoading());

    if (res.status !== 'OK') {
      console.log(res);
      return dispatch(
        setTempError(res.message || 'Hubo un problema al cancelar la cesión')
      );
    }

    dispatch(setLot(res.lot));
    dispatch(
      modalUpdate({
        title: 'Cesión cancelada',
        text: 'Se canceló la cesión con exito',
        link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
        okMsg: 'Continuar',
        closeMsg: null,
        type: redTypes.project,
      })
    );
    dispatch(modalEnable());
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
          <h3>Cesión de Derechos</h3>
        </div>
        <div className='left'>
          <button onClick={cancelCession} className='cancel'>
            Cancelar Cesión
          </button>
        </div>
      </div>

      <div className='card edit my-2'>
        <div className='card__header'>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Completar Cesión de Derechos</h4>
        </div>
        <div className='card__body'>
          <div className='left'>
            <div className='card__body__item'>
              <label htmlFor='cessionDate'>
                Fecha en que se completo la Cesión
              </label>
              <input
                name='cessionDate'
                type='date'
                autoComplete='off'
                value={cessionDate}
                onChange={inputChange}
              />
            </div>

            <div className='card__body__item'>
              <label htmlFor='notes'>Notas</label>
              <textarea
                name='notes'
                autoComplete='off'
                value={notes}
                onChange={inputChange}></textarea>
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
          Completar Cesión
        </button>
      </div>
    </div>
  );
};

export default CompleteCession;
