import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setLot } from '../../actions/consults';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import makeServerRequest from '../../helpers/makeServerRequest';
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
    purchaseDate: '',
    purchasePrice: '',
    requestDate: '',
    refundDate: '',
    refundedAmount: '',
    reason: '',
  });

  const {
    purchaseDate,
    purchasePrice,
    requestDate,
    refundDate,
    refundedAmount,
    reason,
  } = formValues;

  const inputChange = ({ target }) => {
    checkEmptyField({ target });
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const onSubmit = async () => {
    if (+refundedAmount < 0) {
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
      purchaseDate,
      purchasePrice,
      requestDate,
      refundDate,
      refundedAmount: +refundedAmount,
      reason: reason || null,
    };

    dispatch(uiStartLoading());

    const res = await cancelRecord(data);

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

      const res = await makeServerRequest('/lots/' + record.lot);

      if (res.status !== 'OK') console.log(res);

      dispatch(setLot(res.lot));
      dispatch(modalUpdate(modalInfo));
      dispatch(modalEnable());
    } else {
      dispatch(setTempError('Hubo un problema con la base de datos'));

      return;
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
        dispatch(uiFinishLoading());
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

  const cancelRefund = async () => {
    dispatch(uiStartLoading());
    const res = await makeServerRequest(
      `/records/${recordId}/cancel-refund`,
      'DELETE'
    );

    dispatch(uiFinishLoading());

    if (res.status !== 'OK') {
      console.log(res);
      return dispatch(
        setTempError(res.message || 'Hubo un problema al cancelar el reembolso')
      );
    }

    dispatch(setLot(res.lot));
    dispatch(
      modalUpdate({
        title: 'Reembolso cancelado',
        text: 'Se canceló el reembolso con exito',
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
          <h3>Cancelar expediente</h3>
        </div>
        <div className='left'>
          <button className='cancel' onClick={cancelRefund}>
            Cancelar Reembolso
          </button>
        </div>
      </div>

      <div className='card edit my-2'>
        <div className='card__header'>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Cancelación de expediente</h4>
        </div>
        <div className='card__body'>
          <div className='left'>
            <div className='card__body__item'>
              <label htmlFor='refundDate'>Fecha de reembolso</label>
              <input
                name='refundDate'
                type='date'
                autoComplete='off'
                value={refundDate}
                onChange={inputChange}
              />
            </div>

            <div className='card__body__item'>
              <label htmlFor='refundedAmount'>
                Cantidad devuelta al cliente
              </label>
              <input
                name='refundedAmount'
                type='number'
                autoComplete='off'
                value={refundedAmount}
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
