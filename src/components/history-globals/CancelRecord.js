import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import { redTypes } from '../../types/reduxTypes';
import { staticURL } from '../../url';
import { ClientShort } from '../clients/ClientShort';
import { Record } from './Record';

export const CancelRecord = () => {
  const dispatch = useDispatch();
  const { recordId } = useParams();

  const {
    historyActions: { lot: currentLot },
    clients,
  } = useSelector(state => state);

  const { record } = currentLot;

  const currentClient = clients.find(c => c._id === record?.customer);

  useEffect(() => {
    dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
    dispatch(redirectSet(redTypes.history, `/historial/cancelar/${recordId}`));
  }, [dispatch, recordId]);

  const [emptyFields, setEmptyFields] = useState([]);

  const [formValues, setFormValues] = useState({
    refundedAmount: '',
    type: '',
    markAsNextPayment: false,
  });

  const { refundedAmount, cancelledAt, reason } = formValues;

  const inputChange = e => {
    checkEmptyField(e);
    setFormValues({ ...formValues, refundedAmount: e.target.value });
  };

  const onSubmit = async () => {
    if (+refundedAmount === 0) {
      const tempEmptyFields = emptyFields;

      if (tempEmptyFields.includes('refundedAmount')) {
        const index = tempEmptyFields.indexOf('refundedAmount');

        tempEmptyFields.splice(index, 1);
      } else {
        tempEmptyFields.push('refundedAmount');
      }

      setEmptyFields(tempEmptyFields);
      dispatch(
        setTempError(
          'Debe ingresar una cantidad que se le reembolsó al cliente'
        )
      );

      return;
    }

    const data = {
      refundedAmount: +refundedAmount,
      cancelledAt: cancelledAt || null,
      reason: reason || null,
    };

    dispatch(uiStartLoading());

    console.log('esta es la data: ', data);

    const res = await cancelRecord(data);

    dispatch(uiFinishLoading());

    console.log(res);

    if (res) {
      if (res.status === 'OK') {
        const modalInfo = {
          title: `Historial cancelado con exito`,
          text: `Se ha cancelado el historial`,
          link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
          okMsg: 'Continuar',
          closeMsg: null,
          type: redTypes.project,
        };

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
      } else {
        dispatch(setTempError('Hubo un problema con la base de datos'));

        return;
      }
    }
  };

  const cancelRecord = data => {
    const url = `${staticURL}/records/${recordId}/cancel`;

    const res = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
        // dispatch(uiFinishLoading());
      });

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
      text: '¿Desea abortar la cancelación del historial?',
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
          <h3> Cancelar historial </h3>
        </div>
      </div>

      <div className='card edit my-2'>
        <div className='card__header'>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Cancelación de historial</h4>
        </div>
        <div className='card__body'>
          <div className='right'>
            <div
              className={`card__body__item ${
                emptyFields.includes('refundedAmount') && 'error'
              }`}>
              <label htmlFor='refundedAmount'>
                Cantidad devuelta al cliente
              </label>
              <input
                autoFocus
                name='refundedAmount'
                type='number'
                autoComplete='off'
                value={refundedAmount}
                onChange={inputChange}
              />
            </div>

            <div
              className={`card__body__item ${
                emptyFields.includes('cancelledAt') && 'error'
              }`}>
              <label htmlFor='cancelledAt'>Fecha de cancelación</label>
              <input
                autoFocus
                name='cancelledAt'
                type='date'
                autoComplete='off'
                value={cancelledAt}
                onChange={inputChange}
              />
            </div>

            <div
              className={`card__body__item ${
                emptyFields.includes('reason') && 'error'
              }`}>
              <label htmlFor='reason'>motivo de cancelación</label>
              <input
                autoFocus
                name='reason'
                type='text'
                autoComplete='off'
                value={reason}
                onChange={inputChange}
              />
            </div>
          </div>
          <div className='left'></div>
        </div>
      </div>

      {record._id && <Record record={record} payment={true} />}

      {currentClient && <ClientShort client={currentClient} />}

      <div className='form-buttons'>
        <button className='cancel' onClick={cancel}>
          Cancelar
        </button>
        <button className='next' onClick={onSubmit}>
          Confirmar Cancelación
        </button>
      </div>
    </div>
  );
};
