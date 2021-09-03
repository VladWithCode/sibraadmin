import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { EditPayment } from './EditPayment';

export const ExtraPaymentsEdit = ({ recordId }) => {
    const { records, historyActions: { record: { extraCharges: stateExtraCharges } } } = useSelector(state => state);

    const currentRecord = records.find(r => r._id === recordId);

    const [extraCharges, setExtraCharges] = useState(stateExtraCharges);

    useEffect(() => {

        setExtraCharges(stateExtraCharges);

    }, [stateExtraCharges])

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
        <div className="card edit mt-2">

            <div className="card__header" >
                <img src="../assets/img/services.png" alt="" />
                <h4>Pagos a cargos extras</h4>

            </div>

            <div className="card__body">

                {
                    extraCharges.map((extraCharge, index) => {

                        let amountPayed = 0;

                        extraCharge.payments.forEach(p => {
                            amountPayed += +p.amount
                        })

                        if (extraCharge.payments.length > 0) {
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
                                        <div className="card__body__item">
                                            <span>cantidad pagada</span>
                                            <p className="payed"> ${amountPayed.toLocaleString()} </p>
                                        </div>
                                        <div className="card__body__item">
                                            <span>deuda pendiente</span>
                                            <p className="debt" > ${(extraCharge.debt - amountPayed).toLocaleString()} </p>
                                        </div>
                                    </div>

                                    {


                                        extraCharge.payments.map((payment, index) => (
                                            <EditPayment key={index} payment={payment} index={index} hasChanged={hasChanged(payment, extraCharge._id)} extraCharge={true} extraChargeId={extraCharge._id} />
                                        ))

                                    }
                                </div>
                            )
                        }

                        return null
                    })
                }

            </div>


        </div>
    )
}
