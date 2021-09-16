


import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { buyLotSetExtraCharges } from '../../actions/payments';

export const BuyExtraCharges = ({ extraCharges }) => {

    const dispatch = useDispatch();

    const [payBefore, setPayBefore] = useState(extraCharges.map(e => ({
        ...e,
        payBefore: e.payBefore || ''
    })))

    const onInput = (e, _id) => {

        const currentCharge = payBefore.find(p => p._id === _id);

        currentCharge.payBefore = e.target.value;

        setPayBefore(payBefore);

        dispatch(buyLotSetExtraCharges(payBefore));

    }

    console.log("payBefore: ", payBefore);

    return (
        <div className="card edit">
            <div className="card__header">
                <img src="../assets/img/services.png" alt="" />
                <h4>Cargos extras</h4>
            </div>
            <div className="card__body">
                {
                    extraCharges.map(({ title, _id, amount }) => (
                        <>
                            <div className="card__header mt-2">
                                <h4>{title}</h4>
                            </div>
                            <div className="card__body__item">
                                <span>Precio</span>
                                <p>${amount.toLocaleString()}</p>
                            </div>
                            <div className="card__body__item">
                                <span>Fecha límite de pago</span>
                                <input onChange={e => onInput(e, _id)} type="date" value={payBefore.find(p => p._id === _id).payBefore} />
                            </div>
                        </>
                    ))
                }
            </div>
        </div>
    )
}
