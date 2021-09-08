import React from 'react'
import { useSelector } from 'react-redux';
import { EditPayment } from './EditPayment';

export const ExtraPaymentEdit = ([extraCharge, index, recordId]) => {


    const { records } = useSelector(state => state);

    const currentRecord = records.find(r => r._id === recordId);
    // let amountPayed = 0;

    //                     extraCharge.payments.forEach(p => {
    //                         amountPayed += +p.amount
    //                     })


    const hasChanged = (payment, extraChargeId) => {

        const compareTo = currentRecord?.extraCharges.find(e => e._id === extraChargeId).payments.find(p => p._id === payment._id);

        if (compareTo?.amount.toString() !== payment.amount.toString()) {
            return true
        }

        if ((compareTo?.date.split('T')[0] === payment.date.split('T')[0]) || (compareTo.date.split('T')[0] === payment.date)) {
            return false
        }

        return true
    }

    return (
        <div key={extraCharge._id} className={`full ${index > 0 && 'mt-2'}`}>

            <div className="left">
                <div className="card__header pt-2" >
                    <h4>{extraCharge.title}</h4>
                </div>
                <div className="card__body__item">
                    <span>monto del cargo</span>
                    <p className="price" > ${extraCharge.debt.toLocaleString()} </p>
                </div>
                {/* <div className="card__body__item">
                    <span>cantidad pagada</span>
                    <p className="payed"> ${amountPayed.toLocaleString()} </p>
                </div>
                <div className="card__body__item">
                    <span>deuda pendiente</span>
                    <p className="debt" > ${(extraCharge.debt - amountPayed).toLocaleString()} </p>
                </div> */}
            </div>

            {
                extraCharge.payments.map((payment, index) => (
                    <EditPayment key={index} payment={payment} index={index} hasChanged={hasChanged(payment, extraCharge._id)} extraCharge={true} extraChargeId={extraCharge._id} />
                ))
            }
        </div>
    )
}
