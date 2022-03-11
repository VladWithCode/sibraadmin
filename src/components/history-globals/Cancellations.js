import React from 'react';
import { dateToReadableString } from '../../helpers/dateHelpers';
import { priceToString } from '../../helpers/generalHelpers';

export const Cancellations = ({ cancellations }) => {
  return (
    <div className='card'>
      {cancellations.map((c, index) => {
        const {
          _id,
          customerFullname,
          rfc,
          curp,
          phoneNumber,
          email,
          purchaseDate,
          purchasePrice,
          requestDate,
          commissionAmount,
          hadCommission,
          refundDate,
          refundedAmount,
          reason,
          lotAmountPayed,
          chargeAmountPayed,
          chargesPayed,
          finished,
        } = c;

        return (
          <div key={_id}>
            <div className={`card__header ${index > 1 ? 'mt-4' : 'mt-1'}  `}>
              <h4>Cancelación de {customerFullname}</h4>
            </div>

            <div className='card__body'>
              <div className='left'>
                <h4 className='mb-1'>Datos de Cliente</h4>
                <div className='card__body__item'>
                  <span>Cliente</span>
                  <p>{customerFullname}</p>
                </div>

                <div className='card__body__item'>
                  <span>Número de contacto</span>
                  <p>{phoneNumber}</p>
                </div>

                {email && (
                  <div className='card__body__item'>
                    <span>Correo electrónico</span>
                    <p>{email}</p>
                  </div>
                )}

                {rfc && (
                  <div className='card__body__item'>
                    <span>RFC</span>
                    <p>{rfc}</p>
                  </div>
                )}

                {curp && (
                  <div className='card__body__item'>
                    <span>CURP</span>
                    <p>{curp}</p>
                  </div>
                )}
              </div>

              <div className='left'>
                <h4 className='mb-1'>Datos de expediente</h4>

                <div className='card__body__item'>
                  <span>Estado</span>
                  <p className={finished ? 'text-danger' : 'debt'}>
                    {finished ? 'Cancelada' : 'Pendiente'}
                  </p>
                </div>

                <div className='card__body__item'>
                  <span>Fecha de solicitud</span>
                  <p>{dateToReadableString(requestDate)}</p>
                </div>

                {reason && (
                  <div className='card__body__item'>
                    <span>Razón de cancelación</span>
                    <p className='debt'>{reason}</p>
                  </div>
                )}

                <div className='card__body__item'>
                  <span>Fecha de reembolso</span>
                  {refundDate ? (
                    <p>{dateToReadableString(refundDate)}</p>
                  ) : (
                    <p>Reembolso pendiente de entregar</p>
                  )}
                </div>

                <div className='card__body__item'>
                  <span>Precio</span>
                  <p className='price'>
                    ${purchasePrice ? priceToString(purchasePrice) : 0}
                  </p>
                </div>

                <div className='card__body__item'>
                  <span>Fecha de Compra</span>
                  <p>{dateToReadableString(purchaseDate)}</p>
                </div>

                {lotAmountPayed && (
                  <div className='card__body__item'>
                    <span>Cantidad Pagada (Lote)</span>
                    <p className='price'>${priceToString(lotAmountPayed)}</p>
                  </div>
                )}

                {chargeAmountPayed >= 0 ? (
                  <div className='card__body__item'>
                    <span>Cantidad pagada (Cargos Extra)</span>
                    <p className='price'>${priceToString(chargeAmountPayed)}</p>
                  </div>
                ) : (
                  ''
                )}

                {chargeAmountPayed > 0 &&
                  chargesPayed?.map(xc => (
                    <div className='card__body__item'>
                      <span>Cantidad pagada ({xc.name})</span>
                      <p className='price'>${priceToString(xc.amount)}</p>
                    </div>
                  ))}

                {hadCommission && (
                  <div className='card__body__item'>
                    <span>Cantidad de comisión</span>
                    <p className='debt'>${priceToString(commissionAmount)}</p>
                  </div>
                )}

                <div className='card__body__item'>
                  <span>Cantidad devuelta al cliente</span>
                  <p className='debt'>
                    ${refundedAmount ? priceToString(refundedAmount) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
