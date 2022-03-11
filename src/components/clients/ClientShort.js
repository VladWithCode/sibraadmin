import React from 'react';
import { dateToReadableString } from '../../helpers/dateHelpers';

export const ClientShort = ({ client, cession }) => {
  const { names, patLastname, matLastname, _id, rfc, occupation } = client;
  const wasCeded = !!cession?.completed;

  return (
    <div className='card'>
      <div className={`card__body${wasCeded ? ' mb-3' : ''}`}>
        {wasCeded && <div className='cession-overlay'>CEDIDO</div>}
        <div className='card__header'>
          <img src='../assets/img/user.png' alt='' />
          <h4>Información básica del cliente</h4>
        </div>
        <div className='left'>
          <div className='card__body__item'>
            <span>nombre(s)</span>
            <p> {names} </p>
          </div>
          <div className='card__body__item'>
            <span>apellido paterno</span>
            <p> {patLastname} </p>
          </div>
          {matLastname && (
            <div className='card__body__item'>
              <span>apelido materno</span>
              <p> {matLastname} </p>
            </div>
          )}
        </div>

        <div className='left'>
          {rfc ? (
            <div className='card__body__item'>
              <span>RFC</span>
              <p> {rfc} </p>
            </div>
          ) : (
            <div className='card__body__item'>
              <span>ID</span>
              <p> {_id} </p>
            </div>
          )}
          {occupation && (
            <div className='card__body__item'>
              <span>ocupación</span>
              <p> {occupation} </p>
            </div>
          )}
        </div>
      </div>
      {wasCeded && (
        <>
          <div className='card__header'>
            <img src='../assets/img/user.png' alt='cliente' />
            <h4>Datos de Cesión</h4>
          </div>
          <div className='card__body'>
            <div className='right'>
              <div className='card__body__item'>
                <span>Nombre del Cesionado</span>
                <p>{cession.assignee}</p>
              </div>
              <div className='card__body__item'>
                <span>Fecha de solicitud</span>
                <p className='text-capitalize'>
                  {dateToReadableString(cession.requestDate)}
                </p>
              </div>
              <div className='card__body__item'>
                <span>Fecha de Cesión</span>
                <p className='text-capitalize'>
                  {dateToReadableString(cession.cessionDate)}
                </p>
              </div>
              {cession.notes && (
                <div className='card__body__item'>
                  <span>Notas</span>
                  <p>{cession.notes}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
