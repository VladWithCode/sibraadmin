import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EditPayment } from './EditPayment';

export const PaymentsEdit = ({ recordId }) => {


    const { records, historyActions: { record: { payments: statePayments } } } = useSelector(state => state);

    const currentRecord = records.find(r => r._id === recordId);

    const [payments, setPayments] = useState(statePayments);

    useEffect(() => {

        setPayments(statePayments);

    }, [statePayments])

    const hasChanged = payment => {

        const compareTo = currentRecord?.payments.find(p => p._id === payment._id);

        if (compareTo?.amount.toString() !== payment.amount.toString()) {
            return true
        }

        if ((compareTo?.payedAt.split('T')[0] === payment.payedAt.split('T')[0]) || (compareTo.payedAt.split('T')[0] === payment.payedAt)) {
            return false
        }


        return true
    }

    return (
        <div className="card edit mt-2">

            <div className="card__header pointer pb-2" >
                <img src="../assets/img/payment.png" alt="" />
                <h4>Pagos</h4>

            </div>

            <div className="card__body">
                <div className={`full`}>
                    {
                        payments.length > 0 && (
                            payments.map((payment, index) => (
                                <EditPayment key={index} payment={payment} index={index} hasChanged={hasChanged(payment)} />
                            ))
                        )
                    }
                </div>
            </div>


        </div>
    )
}
