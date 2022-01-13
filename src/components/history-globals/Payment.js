import React from 'react';
import { useDispatch } from 'react-redux';
import { getLot } from '../../actions/lot';
import { uiFinishLoading, uiStartLoading } from '../../actions/ui';
import { dateToReadableString } from '../../helpers/dateHelpers';
import { staticURL } from '../../url';

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const Payment = ({
  payment,
  index,
  charge,
  recordId,
  paymentId,
  chargeId,
  lotId,
}) => {
  const dispatch = useDispatch();

  const {
    date,
    payedAt,
    amount,
    type,
    wasLate,
    ogPaymentDate,
    hadProrogation,
    staticPath,
  } = payment;

  const displayType =
    type === 'preReservation'
      ? 'Pre apartado'
      : type === 'payment'
      ? 'Abono'
      : type === 'deposit'
      ? 'Enganche'
      : 'Liquidación';

  const dispDate = new Date(payedAt ? payedAt : date).toLocaleDateString(
    'es-MX',
    dateOptions
  );
  const state = hadProrogation
    ? 'en prórroga'
    : wasLate
    ? 'retardado'
    : 'en tiempo';
  const stateClass = hadProrogation
    ? 'warning'
    : wasLate
    ? 'danger'
    : 'success';

  const generateReceipt = async () => {
    const url = !charge
      ? `${staticURL}/record/${recordId}/payment/${paymentId}/receipt`
      : `${staticURL}/record/${recordId}/charge/${chargeId}/payment/${paymentId}/receipt`;

    console.log(url);

    dispatch(uiStartLoading());
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: null }),
    });

    const data = await res.json();
    dispatch(uiFinishLoading());

    if (data.status === 'OK') {
      dispatch(getLot(lotId));
    }
  };

  return (
    <div className={` ${index > 0 ? 'mt-5' : 'mt-2'} `}>
      {type && (
        <div className='card__header'>
          <h4>{displayType}</h4>
          {type !== 'deposit' && (
            <div className={`state ${stateClass}`}>{state}</div>
          )}
        </div>
      )}

      <div className='card__body__item'>
        <span>Cantidad</span>
        <p className='price'> ${amount.toLocaleString()} </p>
      </div>
      <div className='card__body__item text-capitalize'>
        <span>Fecha de pago</span>
        <p> {dispDate} </p>
      </div>
      <div className='card__body__item'>
        <span>recibo generado</span>
        {staticPath ? (
          <p>Sí</p>
        ) : (
          <p
            style={{
              color: '#14E95F',
              cursor: 'pointer',
            }}
            onClick={generateReceipt}>
            Generar recibo
          </p>
        )}
      </div>

      {ogPaymentDate && (
        <div className='card__body__item text-capitalize'>
          <span>Fecha original</span>
          <p> {dateToReadableString(new Date(ogPaymentDate))} </p>
        </div>
      )}
    </div>
  );
};
