import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { ExtraCharge } from './ExtraCharge';
import { Payment } from './Payment';

export const History = ({ record }) => {

    const { lotNumber, manzana, lotArea, payments, extraCharges, paymentInfo: { lotPrice, lotAmountDue, amountPayed, lapseLeft } } = record;
    const state = record.state === 'available' ? 'Disponible' : record.state === 'delivered' ? 'Entregado' : record.state === 'reserved' ? 'Comprado' : 'Liquidado';

    const { projects } = useSelector(state => state);
    const { name: projectName } = projects.find(p => p._id === record.project);

    const [activeSections, setActiveSections] = useState({
        payments: false,
        extraCharges: false
    })

    const switchActive = section => {
        setActiveSections({
            ...activeSections,
            [section]: !activeSections[section]
        })
    }

    return (
        <div className="card">
            <div className="card__header">
                <img src="../assets/img/info.png" alt="" />
                <h4>Lote en {projectName} </h4>
            </div>
            <div className="card__body">
                <div className="right">
                    <div className="card__body__item">
                        <span>número de manzana</span>
                        <p> {manzana} </p>
                    </div>
                    <div className="card__body__item">
                        <span>número de lote</span>
                        <p> {lotNumber} </p>
                    </div>
                    <div className="card__body__item">
                        <span>Área del lote</span>
                        <p> {lotArea}m<sup>2</sup> </p>
                    </div>

                </div>
                <div className="left">
                    <div className="card__body__item">
                        <span>precio del lote</span>
                        <p className="price"> ${lotPrice.toLocaleString()} </p>
                    </div>
                    <div className="card__body__item">
                        <span>pagado</span>
                        <p className="payed"> ${amountPayed.toLocaleString()} </p>
                    </div>
                    <div className="card__body__item">
                        <span>deuda</span>
                        <p className="debt" > ${lotAmountDue.toLocaleString()} </p>
                    </div>
                    <div className="card__body__item">
                        <span>pagos restantes</span>
                        <p> {lapseLeft} </p>
                    </div>

                </div>

                <div className="card__header pointer mt-3" onClick={() => switchActive('payments')}>
                    <img src="../assets/img/payment.png" alt="" />
                    <h4>Pagos</h4>
                    <span className={`dropdown ${activeSections.payments && 'active'} `}>v</span>
                </div>

                <div className={`full ${!activeSections.payments && 'inactive'} `}>
                    {
                        payments.length > 0 && (
                            payments.map((payment, index) => (
                                <Payment key={index} payment={payment} index={index} />
                            ))
                        )
                    }
                </div>

                <div className="card__header pointer mt-3" onClick={() => switchActive('extraCharges')}>
                    <img src="../assets/img/services.png" alt="" />
                    <h4>Pagos extras</h4>
                    <span className={`dropdown ${activeSections.extraCharges && 'active'} `}>v</span>
                </div>

                <div className={`full ${!activeSections.extraCharges && 'inactive'} `}>
                    {
                        extraCharges && (
                            extraCharges.map((extraCharge, index) => (
                                <ExtraCharge key={index} extraCharge={extraCharge} index={index + 1} />
                            ))
                        )
                    }
                </div>


            </div>
        </div>
    )
}
