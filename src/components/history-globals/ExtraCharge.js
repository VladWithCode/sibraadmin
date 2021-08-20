import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redTypes } from '../../types/reduxTypes';
import { Payment } from './Payment';

export const ExtraCharge = ({ extraCharge, index }) => {

    const dispatch = useDispatch();

    const { debt, title, payBefore, amountPayed, isPayed, payments, _id } = extraCharge;

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    const date = new Date(payBefore).toLocaleDateString('es-MX', dateOptions);

    const [activeSections, setActiveSections] = useState({
        payments: false
    })

    const switchActive = section => {
        setActiveSections({
            ...activeSections,
            [section]: !activeSections[section]
        })
    }

    const pay = () => {

        const modalInfo = {
            title: 'Abonar',
            text: `Desea abonar al cargo de ${title}`,
            link: `/proyectos/extras/abonar/${_id}`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.clientEdit
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());

    }

    return (
        <div className="full">
            <div className="card__header my-4">
                <h4>Extra {index} </h4>
                {
                    isPayed ? (
                        <span className="add-ref">Pagado</span>
                    ) : (
                        <button onClick={pay} className="add-ref ok">Abonar</button>
                    )
                }
            </div>

            <div className="card__body__item">
                <span>Nombre del cargo</span>
                <p>{title}</p>
            </div>
            <div className="card__body__item">
                <span>precio</span>
                <p>${debt?.toLocaleString()}</p>
            </div>

            {
                !isPayed && (
                    <>
                        <div className="card__body__item">
                            <span>saldo pagado</span>
                            <p>${amountPayed.toLocaleString()}</p>
                        </div>
                        <div className="card__body__item">
                            <span>fecha limite de pago</span>
                            <p>{date}</p>
                        </div>
                    </>
                )
            }

            {
                payments[0] && (
                    <>
                        <div className="card__header pointer mt-3" onClick={() => switchActive('payments')}>
                            <h4>Pagos</h4>
                            <span className={`dropdown ${activeSections.payments && 'active'} `}>v</span>
                        </div>

                        <div className={`full ${!activeSections.payments && 'inactive'} `}>
                            {
                                payments.map((payment, index) => (
                                    <Payment payment={payment} index={index} />
                                ))

                            }
                        </div>
                    </>
                )
            }

        </div>
    )
}
