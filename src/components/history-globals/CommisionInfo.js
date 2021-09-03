import React from 'react'

export const CommissionInfo = ({ commissionInfo }) => {

    const { payedAt, amount, payedTo } = commissionInfo;

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }


    const date = new Date(payedAt).toLocaleDateString('es-MX', dateOptions);


    return (
        <>
            <div className="card__body__item">
                <span>Cantidad de comisión</span>
                <p> ${amount?.toLocaleString()} </p>
            </div>
            <div className="card__body__item">
                <span>Asesor</span>
                <p> {payedTo} </p>
            </div>
            <div className="card__body__item">
                <span>Fecha cuando fue pagada</span>
                <p> {date} </p>
            </div>
        </>
    )


}
