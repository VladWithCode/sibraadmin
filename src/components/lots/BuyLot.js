import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';
import { redirectSet } from '../../actions/redirect';
import { useParams } from 'react-router-dom';
import { getClients } from '../../actions/consults';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { ClientShort } from '../clients/ClientShort';
import { buyLotSet, submitPayment } from '../../actions/payments';
import { BuyExtraCharges } from './BuyExtraCharges';
import { Floating } from '../Floating';
import { QuickRegister } from '../clients/QuickRegister';

export const BuyLot = () => {
  const dispatch = useDispatch();
  const { projectId, lotId } = useParams();
  const { lot, clients, paymentInfo } = useSelector(state => state);

  const { state } = lot;

  const initialForm = {
    depositAmount: paymentInfo?.depositAmount,
    lotPrice: +paymentInfo?.lotPrice > 0 ? paymentInfo?.lotPrice : lot.price,
    recordOpenedAt: paymentInfo?.recordOpenedAt,

    // in case of reservation
    reservationDate: paymentInfo?.reservationDate,
    preReservationDate: paymentInfo?.preReservationDate,
    preReservationAmount: paymentInfo?.preReservationAmount,

    // comission
    payedTo: paymentInfo?.payedTo,
    amount: paymentInfo?.amount,
    payedAt: paymentInfo?.payedAt,

    //PENDING payed

    lapseToPay: paymentInfo?.lapseToPay,
  };

  const [extraInfo, setExtraInfo] = useState(() => {
    return {
      client: paymentInfo?.client,
      clientName: paymentInfo?.clientName,
      liquidate: paymentInfo?.liquidate,

      // in case of reservation
      preReserved: state === 'preReserved' ? true : false,

      history: paymentInfo?.history,

      // payment ifo
      lapseType: paymentInfo?.lapseType,
      paymentsDate: paymentInfo?.paymentsDate,
    };
  });

  const [client, setClient] = useState(
    clients.find(c => c._id.toString() === extraInfo.client.toString())
  );

  const [payments, setPayments] = useState(paymentInfo?.payments);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  const [formFields, onInputChange] = useForm(initialForm);

  const {
    depositAmount,
    lotPrice,
    recordOpenedAt,
    reservationDate,
    preReservationDate,
    preReservationAmount,
    payedTo,
    amount,
    payedAt,
    lapseToPay,
  } = formFields;

  const [emptyFields] = useState([]);

  useEffect(() => {
    dispatch(
      redirectSet(
        redTypes.projects,
        `/proyectos/comprar/${projectId}/lote/${lotId}`
      )
    );
    dispatch(getClients());
  }, [dispatch, projectId, lotId]);

  const onPaymentChange = (e, index, key) => {
    const newPayments = payments.map(p => p);

    newPayments[index][key] = e.target.value;

    setPayments(newPayments);
  };

  const addPayment = () => {
    const newPayment = {
      amount: '',
      paymentDate: '',
      payedDate: '',
    };

    setPayments([...payments, newPayment]);
    // dispatch(projectSet({ ...project, extraCharges: [...extraCharges, newPayment] }));
  };

  const deletePayment = index => {
    const newPayments = payments.map(p => p);
    newPayments.splice(index, 1);

    setPayments(newPayments);
  };

  const cancel = () => {
    const modalInfo = {
      title: 'Cancelar el pago del lote',
      text: '¿Desea cancelar el pago?',
      link: `proyectos/ver/${projectId}/lote/${lotId}`,
      okMsg: 'Sí',
      closeMsg: 'No',
      type: redTypes.projectCreate,
    };

    dispatch(modalUpdate(modalInfo));
    dispatch(modalEnable());
  };

  const onFieldChange = e => {
    onInputChange(e);
    dispatch(
      buyLotSet({
        [e.target.name]: e.target.value,
      })
    );
  };

  const onExtraInfoChange = newInfo => {
    setExtraInfo({
      ...extraInfo,
      ...newInfo,
    });

    dispatch(buyLotSet(newInfo));
  };

  // Add new customer
  const [newCustomer, setNewCustomer] = useState(null);

  // Floating window
  const [activeFloating, setActiveFloating] = useState(false);
y
  return (
    <div className='pb-5 project create'>
      {activeFloating && (
        <Floating setActiveFloating={setActiveFloating}>
          <QuickRegister
            newCustomer={newCustomer}
            setNewCustomer={setNewCustomer}
            activeFloating={activeFloating}
            setActiveFloating={setActiveFloating}
            setClient={setClient}
          />
        </Floating>
      )}
      <div className='project__header'>
        <div className='left'>
          <h3> Compra de Lote </h3>
          <p className='small'>
            Lote {lot.lotNumber} - Manzana {lot.manzana}
          </p>
        </div>
        {state !== 'preReserved' && (
          <div className='options'>
            {extraInfo.liquidate ? (
              <input
                type='radio'
                value={true}
                onClick={() =>
                  onExtraInfoChange({
                    history: false,
                    preReserved: false,
                    liquidate: true,
                  })
                }
                id='liquidate'
                name='action'
                defaultChecked
              />
            ) : (
              <input
                type='radio'
                value={true}
                onClick={() =>
                  onExtraInfoChange({
                    history: false,
                    preReserved: false,
                    liquidate: true,
                  })
                }
                id='liquidate'
                name='action'
              />
            )}

            <label htmlFor='liquidate'>
              <div className='option'>Liquidar</div>
            </label>

            <input
              type='radio'
              value={true}
              onClick={() =>
                onExtraInfoChange({
                  history: true,
                  preReserved: false,
                  liquidate: false,
                })
              }
              id='history'
              name='action'
              defaultChecked
            />

            <label htmlFor='history'>
              <div className='option'>Registrar Historial</div>
            </label>
          </div>
        )}
      </div>

      <div className='card edit mt-4'>
        <div className='card__header'>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Información del pago</h4>
        </div>
        <div className='card__body'>
          <div className='right'>
            <div
              className={`card__body__item ${
                emptyFields.includes('lotPrice') && 'error'
              }`}>
              <label htmlFor='lotPrice'>Precio de Lote</label>
              <input
                autoFocus
                name='lotPrice'
                type='number'
                autoComplete='off'
                onChange={onFieldChange}
                value={lotPrice}
              />
            </div>

            {!extraInfo.liquidate ? (
              <>
                {!extraInfo.preReserved ? (
                  <>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes('depositAmount') && 'error'
                      }`}>
                      <label htmlFor='depositAmount'>Enganche</label>
                      <input
                        name='depositAmount'
                        type='number'
                        autoComplete='off'
                        onChange={onFieldChange}
                        value={depositAmount}
                      />
                    </div>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes('recordOpenedAt') && 'error'
                      }`}>
                      <label htmlFor='recordOpenedAt'>
                        Inicio de historial
                      </label>
                      <input
                        name='recordOpenedAt'
                        type='date'
                        autoComplete='off'
                        onChange={onFieldChange}
                        value={recordOpenedAt}
                      />
                    </div>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes('reservationDate') && 'error'
                      }`}>
                      <label htmlFor='reservationDate'>Fecha de apartado</label>
                      <input
                        name='reservationDate'
                        type='date'
                        autoComplete='off'
                        onChange={onFieldChange}
                        value={reservationDate}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes('preReservationDate') && 'error'
                      }`}>
                      <label htmlFor='preReservationDate'>
                        Fecha de preapartado
                      </label>
                      <input
                        name='preReservationDate'
                        type='date'
                        autoComplete='off'
                        onChange={onFieldChange}
                        value={preReservationDate}
                      />
                    </div>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes('preReservationAmount') && 'error'
                      }`}>
                      <label htmlFor='preReservationAmount'>
                        Cantidad de preapartado
                      </label>
                      <input
                        name='preReservationAmount'
                        type='number'
                        autoComplete='off'
                        onChange={onFieldChange}
                        value={preReservationAmount}
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div
                className={`card__body__item ${
                  emptyFields.includes('reservationDate') && 'error'
                }`}>
                <label htmlFor='reservationDate'>Fecha de compra</label>
                <input
                  name='reservationDate'
                  type='date'
                  autoComplete='off'
                  onChange={onFieldChange}
                  value={reservationDate}
                />
              </div>
            )}
          </div>
          <div className='left'>
            {!extraInfo.liquidate && (
              <>
                {!extraInfo.preReserved && (
                  <>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes('lapseType') && 'error'
                      }`}>
                      <label>Tipo de Pagos</label>
                      <div className='options'>
                        <input
                          type='radio'
                          name='lapseType'
                          onClick={() =>
                            onExtraInfoChange({ lapseType: 'mensual' })
                          }
                          id='mensual'
                        />
                        <label htmlFor='mensual'>Mensual</label>

                        <input
                          type='radio'
                          name='lapseType'
                          onClick={() =>
                            onExtraInfoChange({ lapseType: 'semanal' })
                          }
                          id='semanal'
                        />
                        <label htmlFor='semanal'>Semanal</label>
                      </div>
                    </div>

                    <div
                      className={`card__body__item ${
                        emptyFields.includes('paymentsDate') && 'error'
                      }`}>
                      <label htmlFor='payDay'>Día de pago</label>
                      {extraInfo.lapseType === 'semanal' ? (
                        <select
                          onChange={e =>
                            onExtraInfoChange({ paymentsDate: e.target.value })
                          }
                          name='payDay'
                          id='payDay'>
                          <option value=''></option>

                          {days.map(day => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name='paymentsDay'
                          type='number'
                          autoComplete='off'
                          onChange={e =>
                            onExtraInfoChange({ paymentsDate: e.target.value })
                          }
                          value={extraInfo.paymentsDate}
                        />
                      )}
                    </div>

                    {extraInfo.lapseType.length > 2 && (
                      <div
                        className={`card__body__item ${
                          emptyFields.includes('lapseToPay') && 'error'
                        }`}>
                        <label htmlFor='lapseToPay'>Número de pagos</label>
                        <input
                          name='lapseToPay'
                          type='number'
                          autoComplete='off'
                          onChange={onFieldChange}
                          value={lapseToPay}
                        />
                      </div>
                    )}

                    {+lapseToPay > 0 && +depositAmount > 0 && (
                      <div className={`card__body__item`}>
                        <label htmlFor='lapseToPay'>Cantidad por pago</label>
                        <p>
                          {(() => {
                            const value = Math.ceil(
                              (+lotPrice - depositAmount) / +lapseToPay
                            );

                            return `$${value.toLocaleString()}`;
                          })()}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            <div
              className={`card__body__item ${
                emptyFields.includes('client') && 'error'
              }`}>
              <label htmlFor='buyer'>Cliente</label>
              <select
                onChange={e => {
                  const { target } = e;
                  if (target.value === 'add') {
                    setActiveFloating(true);

                    return;
                  }
                  setClient(clients.find(c => c._id === target.value));
                  return;
                }}
                name='buyer'
                id='buyer'
                value={client?._id}
                data-customer-select>
                <option value>&nbsp;</option>
                <option value='add'>Agregar Cliente</option>
                {clients?.map(c => {
                  return (
                    <option key={c.rfc} value={c._id}>
                      {c.fullName}
                    </option>
                  );
                })}
                {newCustomer && (
                  <option
                    key={newCustomer._id}
                    value={newCustomer._id}
                    selected>
                    {newCustomer.fullName}
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className='card-grid my-2'>
        <div className='card edit'>
          <div className='card__header'>
            <img src='../assets/img/aval.png' alt='' />
            <h4>Comisión</h4>
          </div>
          <div
            className={`card__body__item ${
              emptyFields.includes('payedTo') && 'error'
            }`}>
            <label htmlFor='payedTo'>Asesor</label>
            <input
              name='payedTo'
              type='text'
              autoComplete='off'
              onChange={onFieldChange}
              value={payedTo}
            />
          </div>
          <div
            className={`card__body__item ${
              emptyFields.includes('amount') && 'error'
            }`}>
            <label htmlFor='amount'>Comisión</label>
            <input
              name='amount'
              type='number'
              autoComplete='off'
              onChange={onFieldChange}
              value={amount}
            />
          </div>
          <div
            className={`card__body__item ${
              emptyFields.includes('payedAt') && 'error'
            }`}>
            <label htmlFor='payedAt'>Fecha cuando fue pagada</label>
            <input
              name='payedAt'
              type='date'
              autoComplete='off'
              onChange={onFieldChange}
              value={payedAt}
            />
          </div>
        </div>

        {extraInfo.history && (
          <div className='card edit'>
            <div className='card__header'>
              <img src='../assets/img/docs.png' alt='' />
              <h4>Registro de pagos</h4>
              <button onClick={addPayment} className='add-ref'>
                Agregar pago
              </button>
            </div>

            {payments.map((payment, index) => (
              <div key={index}>
                <div className='card__header mt-4'>
                  <h4>Pago {index + 1}</h4>
                  {index !== 0 && (
                    <button
                      onClick={() => deletePayment(index)}
                      className='add-ref delete payment'>
                      &times;
                    </button>
                  )}
                </div>
                <div
                  className={`card__body__item ${
                    emptyFields.includes(`amount${index}`) && 'error'
                  }`}>
                  <label htmlFor={`amount${index}`}>Cantidad de pago</label>
                  <input
                    name={`amount${index}`}
                    type='number'
                    autoComplete='off'
                    onChange={e => onPaymentChange(e, index, 'amount')}
                    value={payment.amount}
                  />
                </div>
                <div
                  className={`card__body__item ${
                    emptyFields.includes(`paymentDate${index}`) && 'error'
                  }`}>
                  <label htmlFor={`paymentDate${index}`}>
                    Fecha programada
                  </label>
                  <input
                    name={`paymentDate${index}`}
                    type='date'
                    autoComplete='off'
                    onChange={e => onPaymentChange(e, index, 'paymentDate')}
                    value={payment.paymentDate}
                  />
                </div>
                <div
                  className={`card__body__item ${
                    emptyFields.includes(`payedDate${index}`) && 'error'
                  }`}>
                  <label htmlFor={`payedDate${index}`}>
                    Fecha cuando fue pagado
                  </label>
                  <input
                    name={`payedDate${index}`}
                    type='date'
                    autoComplete='off'
                    onChange={e => onPaymentChange(e, index, 'payedDate')}
                    value={payment.payedDate}
                  />
                </div>
                <div
                  className={`card__body__item ${
                    emptyFields.includes(`payer${index}`) && 'error'
                  }`}>
                  <label htmlFor={`payer${index}`}>Pagado por</label>
                  <input
                    name={`payer${index}`}
                    type='text'
                    autoComplete='off'
                    onChange={e => onPaymentChange(e, index, 'payer')}
                    value={payment.payer}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {paymentInfo.extraCharges && (
          <BuyExtraCharges extraCharges={paymentInfo.extraCharges} />
        )}
      </div>

      {(client || newCustomer) && (
        <ClientShort client={client || newCustomer} />
      )}

      <div className='form-buttons'>
        <button className='cancel' onClick={cancel}>
          Cancelar
        </button>
        <button
          className='next'
          onClick={() =>
            dispatch(
              submitPayment(
                { ...paymentInfo, client: client._id },
                {
                  projectId,
                  lotId,
                  clientId: client._id,
                  lotPrice:
                    +{ ...paymentInfo, client }?.lotPrice > 0
                      ? paymentInfo?.lotPrice
                      : lot.price,
                }
              )
            )
          }>
          Realizar Pago
        </button>
      </div>
    </div>
  );
};
