import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getLots } from '../../actions/consults';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import { dateToReadableString } from '../../helpers/dateHelpers';
import makeServerRequest from '../../helpers/makeServerRequest';
import { redTypes } from '../../types/reduxTypes';
import { ClientShort } from '../clients/ClientShort';
import { Record } from './Record';

export const RequestRefund = () => {
  const dispatch = useDispatch();
  const { recordId } = useParams();
  const [loading, setLoading] = useState(true);

  const { clients, record } = useSelector(state => state);

  const currentClient = clients.find(c => c._id === record?.customer);

  useEffect(() => {
    dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
    dispatch(redirectSet(redTypes.history, `/historial/cancelar/${recordId}`));
  }, [dispatch, recordId]);

  const [emptyFields, setEmptyFields] = useState([]);

  const [formValues, setFormValues] = useState({
    requestDate: '',
    reason: '',
  });

  const { requestDate, reason } = formValues;

  useEffect(() => {
    if (record) setLoading(false);
  }, [record]);

  if (loading) return <>Cargando...</>;

  const inputChange = ({ target }) => {
    checkEmptyField({ target });
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const onSubmit = async () => {
    const data = {
      requestDate,
      reason: reason || null,
    };

    dispatch(uiStartLoading());

    const res = await requestRefund(data);

    dispatch(uiFinishLoading());

    if (res?.status === 'OK') {
      const modalInfo = {
        title: `Expediente cancelado con exito`,
        text: `Se ha cancelado el expediente`,
        link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
        okMsg: 'Continuar',
        closeMsg: null,
        type: redTypes.project,
      };

      dispatch(getLots(record.project));
      dispatch(modalUpdate(modalInfo));
      dispatch(modalEnable());
    } else {
      dispatch(
        setTempError(res?.message || 'Hubo un problema con la base de datos')
      );

      return;
    }
  };

  const requestRefund = async data => {
    const res = await makeServerRequest(
      `/records/${recordId}/request-refund`,
      'POST',
      { ...data },
      { 'Content-Type': 'application/json' }
    );

    return res;
  };

  const checkEmptyField = e => {
    if (e.target.value?.trim().length > 0) {
      const tempEmptyFields = emptyFields;

      if (tempEmptyFields.includes(e.target.name)) {
        const index = tempEmptyFields.indexOf(e.target.name);

        tempEmptyFields.splice(index, 1);
      }

      setEmptyFields(tempEmptyFields);
    }
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
          <h3>Solicitud de cancelación</h3>
        </div>
      </div>

      <div className='card edit my-2'>
        <div className='card__header'>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Solicitar cancelación de expediente</h4>
        </div>
        <div className='card__body'>
          <div className='left'>
            <div className='card__body__item'>
              <label htmlFor='requestDate'>
                Fecha de solicitud de cancelación
              </label>
              <input
                name='requestDate'
                type='date'
                autoComplete='off'
                value={requestDate}
                onChange={inputChange}
              />
            </div>

            <div className='card__body__item'>
              <label htmlFor='reason'>Razón</label>
              <input
                name='reason'
                type='text'
                autoComplete='off'
                value={reason}
                onChange={inputChange}
              />
            </div>
          </div>
          {/* <div className='left'>
            <div className='card__body__item'>
              <span>Fecha de Compra</span>
              <p>{dateToReadableString(record.paymentInfo.recordOpenedAt)}</p>
            </div>
          </div> */}
        </div>
      </div>

      {record._id && <Record record={record} payment={true} />}

      {currentClient && <ClientShort client={currentClient} />}

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
