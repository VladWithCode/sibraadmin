import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
  historyGetLot,
  historySetRecordInfo,
} from '../../actions/historyActions';
import { setTempError, setTempSuccessNotice } from '../../actions/ui';
import { priceToString } from '../../helpers/generalHelpers';
import { staticURL, staticURLDocs } from '../../url';
import RecordChecks from '../records/RecordChecks';
import RecordNotes from '../records/RecordNotes';
import CancelBtn from './CancelBtn';
import CessionBtn from './CessionBtn';
import { CommissionInfo } from './CommisionInfo';
import { ExtraCharge } from './ExtraCharge';
import { Payment } from './Payment';

export const Record = ({ record, payment }) => {
  const dispatch = useDispatch();
  const { record: stateRecord, records } = useSelector(state => state);
  const { lotId } = useParams();

  const [_record, setRecord] = useState(record);

  useEffect(() => {
    if (!stateRecord && Object.keys(record).length > 0) setRecord(record);
    else if (stateRecord) setRecord(stateRecord);
    else {
      const record = records.find(r => r.lot === lotId);

      if (!record) console.log('El record no existe');

      setRecord(record);
    }
  }, [record, stateRecord]);

  const {
    lotNumber,
    manzana,
    lotArea,
    payments,
    extraCharges,
    receipts,
    paymentInfo: {
      lotPrice,
      lotAmountDue,
      lotAmountPayed,
      lapseLeft,
      lapseType,
      minimumPaymentAmount,
      lapseToPay,
    },
    lot,
  } = _record;

  const state =
    _record.state === 'available'
      ? 'Disponible'
      : _record.state === 'reserved'
      ? 'Pago de Lote Pendiente'
      : _record.state === 'lotpayed'
      ? 'Cargos Extra Pendientes'
      : 'Liquidado';

  const { projects } = useSelector(state => state);

  const { name: projectName } = projects.find(p => p._id === _record.project);

  const [activeSections, setActiveSections] = useState({
    payments: false,
    extraCharges: false,
    commissionInfo: false,
    receipts: false,
  });

  const switchActive = section => {
    setActiveSections({
      ...activeSections,
      [section]: !activeSections[section],
    });
  };

  const updateLot = () => {
    dispatch(historyGetLot(lot));
    dispatch(historySetRecordInfo(_record));
  };

  const markAsDelivered = () => {
    fetch(`${staticURL}/lot/${lot}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doc: { state: 'delivered' },
      }),
    })
      .then(res => res.json())
      .then(res => {
        if (res.status !== 'OK') {
          console.log(res.error);
          return dispatch(
            setTempError(
              res.message || 'Ocurrio un error al actualizar el lote'
            )
          );
        }

        dispatch(setTempSuccessNotice('El lote se actualizo con exito'));
        return updateLot();
      })
      .catch(err => {
        console.error(err);
        dispatch(
          setTempError(
            'Ocurrio un error al intentar conectarse con el servidor'
          )
        );
      });
  };

  const handleOpen = path => {
    const url = `${staticURLDocs}${path}`;

    window.open(
      url,
      '_blank',
      'top=500,left=200,frame=true,nodeIntegration=no'
    );
  };

  return (
    <div className='card mb-3' key={record._id}>
      <div className='card__body mb-2' style={{ position: 'initial' }}>
        <div className='left'>
          <RecordNotes
            notes={_record.notes}
            recordId={_record._id}
            editable={true}
          />
        </div>
        <div className='left'>
          <RecordChecks
            checks={_record.checks}
            record={_record}
            editable={true}></RecordChecks>
        </div>
      </div>
      <div className='card__header'>
        <img src='../assets/img/info.png' alt='' />
        <h4>Lote en {projectName}</h4>
        {_record.state !== 'cancelled' ? (
          <div className='links'>
            {!payment && (
              <>
                <Link
                  onClick={updateLot}
                  to={`/historial/editar/${_record._id}`}
                  className='edit'>
                  editar
                </Link>
                {lot.state !== 'delivered' && (
                  <p
                    style={{
                      fontSize: '16px',
                      marginRight: '3rem',
                      color: '#14e95f',
                      borderBottom: '1px solid',
                    }}
                    onClick={markAsDelivered}>
                    Marcar como Entregado
                  </p>
                )}
                <CessionBtn
                  onClick={updateLot}
                  action={_record.activeCessionId ? 'finish' : 'request'}
                  recordId={_record._id}
                />
                <CancelBtn
                  onClick={updateLot}
                  action={_record.hasPendingCancellation ? 'finish' : 'request'}
                  recordId={_record._id}
                />
              </>
            )}
          </div>
        ) : (
          <span className='cancel cancelled'>Cancelado</span>
        )}
      </div>
      <div className='card__body'>
        <div className='right'>
          <div className='card__body__item'>
            <span>Estado del expediente</span>
            <p> {state} </p>
          </div>
          <div className='card__body__item'>
            <span>número de manzana</span>
            <p> {manzana} </p>
          </div>
          <div className='card__body__item'>
            <span>número de lote</span>
            <p> {lotNumber} </p>
          </div>
          <div className='card__body__item'>
            <span>Área del lote</span>
            <p>
              {lotArea}m<sup>2</sup>{' '}
            </p>
          </div>
        </div>
        <div className='left'>
          <div className='card__body__item'>
            <span>precio del lote</span>
            <p className='price'> ${priceToString(lotPrice)} </p>
          </div>
          <div className='card__body__item'>
            <span>pagado</span>
            <p className='payed'> ${priceToString(lotAmountPayed)} </p>
          </div>
          {_record.state !== 'delivered' &&
            _record.state !== 'lotpayed' &&
            _record.state !== 'liquidated' && (
              <>
                <div className='card__body__item'>
                  <span>deuda restante</span>
                  <p className='debt'> ${priceToString(lotAmountDue)} </p>
                </div>
                <div className='card__body__item'>
                  <span>pagos restantes</span>
                  <p> {Math.ceil(lapseLeft)} </p>
                </div>
                <div className='card__body__item'>
                  <span>tipo de pagos</span>
                  <p> {lapseType} </p>
                </div>

                <div className='card__body__item'>
                  <span>número de pagos</span>
                  <p> {Math.ceil(lapseToPay)} </p>
                </div>

                {minimumPaymentAmount ? (
                  <div className='card__body__item'>
                    <span>cantidad por pago</span>
                    <p> ${priceToString(minimumPaymentAmount)} </p>
                  </div>
                ) : (
                  ''
                )}
              </>
            )}
        </div>

        <div
          className='card__header pointer mt-3'
          onClick={() => switchActive('payments')}>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Pagos</h4>
          <span className={`dropdown ${activeSections.payments && 'active'} `}>
            v
          </span>
        </div>

        <div className={`full ${!activeSections.payments && 'inactive'} `}>
          {payments.length > 0 &&
            payments.map((payment, index) => (
              <Payment
                key={index}
                payment={payment}
                index={index}
                paymentId={payment._id}
                recordId={_record._id}
                lotId={lot}
              />
            ))}
        </div>

        <div
          className='card__header pointer mt-3'
          onClick={() => switchActive('receipts')}>
          <img src='../assets/img/docs.png' alt='' />
          <h4>Generar Recibo</h4>
          <span className={`dropdown ${activeSections.receipts && 'active'} `}>
            v
          </span>
        </div>

        <div className={`full ${!activeSections.receipts && 'inactive'} `}>
          <div className='scroll'>
            <div className='card__body__list'>
              {receipts.length > 0 &&
                receipts.map(({ staticPath, name, _id }, index) => {
                  return (
                    <div
                      onClick={() => {
                        handleOpen(staticPath);
                      }}
                      key={_id}
                      className='card__body__list__doc'>
                      <p>{name ? name : index}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {extraCharges.length > 0 && (
          <>
            <div
              className='card__header pointer mt-3'
              onClick={() => switchActive('extraCharges')}>
              <img src='../assets/img/services.png' alt='' />
              <h4>Pagos extras</h4>
              <span
                className={`dropdown ${
                  activeSections.extraCharges && 'active'
                } `}>
                v
              </span>
            </div>

            <div
              className={`full ${!activeSections.extraCharges && 'inactive'} `}>
              {extraCharges.map((extraCharge, index) => (
                <ExtraCharge
                  key={index}
                  extraCharge={extraCharge}
                  index={index + 1}
                  recordState={_record.state}
                  record={_record}
                />
              ))}
            </div>
          </>
        )}

        <div
          className='card__header pointer mt-3'
          onClick={() => switchActive('commissionInfo')}>
          <img src='../assets/img/user.png' alt='' />
          <h4>Comisión</h4>
          {_record?.commissionInfo ? (
            <span
              className={`dropdown ${
                activeSections.commissionInfo && 'active'
              } `}>
              v
            </span>
          ) : (
            !payment && (
              <Link
                onClick={updateLot}
                to={`/historial/comision/editar/${_record._id}`}
                className={`commission`}>
                Editar
              </Link>
            )
          )}
        </div>

        {_record?.commissionInfo && (
          <div
            className={`full ${!activeSections.commissionInfo && 'inactive'} `}>
            <div className='right mt-5'>
              <CommissionInfo
                recordId={_record._id}
                commissionInfo={_record.commissionInfo}
              />
            </div>
            {!payment && (
              <Link
                onClick={updateLot}
                to={`/historial/comision/editar/${_record._id}`}
                className={`commission`}>
                Editar
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
