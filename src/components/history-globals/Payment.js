import React from 'react'

export const Payment = ({ payment, index }) => {

    const { payedAt, amount, type, wasLate, daysLate, ogPaymentDate, hadProrogation } = payment;

    const displayType = type === 'preReservation' ? 'Pre apartado' : type === 'payment' ? 'Abono' : type === 'deposit' ? 'Enganche' : 'Liquidación';

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    const date = new Date(payedAt).toLocaleDateString('es-MX', dateOptions);
    const state = hadProrogation ? 'en prórroga' : wasLate ? 'retardado' : 'en tiempo';
    const stateClass = hadProrogation ? 'warning' : wasLate ? 'danger' : 'success';

    return (


        <div className={`left ${index > 1 ? 'mt-5' : 'mt-2'} `}>
            <div className="card__header">
                <h4>{displayType}</h4>
                {
                    type !== 'deposit' && (

                        <div className={`state ${stateClass}`}>{state}</div>
                    )
                }
            </div>

            <div className="card__body__item">
                <span>Cantidad</span>
                <p className="price"> ${amount.toLocaleString()} </p>
            </div>
            <div className="card__body__item">
                <span>Fecha de pago</span>
                <p> {date} </p>
            </div>

            {
                wasLate && (
                    <>
                        <div className="card__body__item">
                            <span>Fecha original</span>
                            <p> {ogPaymentDate} </p>
                        </div>
                    </>
                )
            }

        </div>
    )
}