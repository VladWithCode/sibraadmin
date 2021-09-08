import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { ExtraPaymentEdit } from './ExtraPaymentEdit';

export const ExtraPaymentsEdit = ({ recordId }) => {
    const { historyActions: { record: { extraCharges: stateExtraCharges } } } = useSelector(state => state);

    const [extraCharges, setExtraCharges] = useState(stateExtraCharges);

    useEffect(() => {

        setExtraCharges(stateExtraCharges);

    }, [stateExtraCharges])

    return (
        <div className="card edit mt-2">

            <div className="card__header" >
                <img src="../assets/img/services.png" alt="" />
                <h4>Pagos a cargos extras</h4>

            </div>

            <div className="card__body">

                {
                    extraCharges.map((extraCharge, index) => {

                        <ExtraPaymentEdit extraCharge={extraCharge} index={index} recordId={recordId} />

                    })
                }

            </div>


        </div>
    )
}
