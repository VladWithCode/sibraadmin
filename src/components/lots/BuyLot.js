import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm'
import { redTypes } from '../../types/reduxTypes'
import { redirectSet } from '../../actions/redirect';
import { useParams } from 'react-router-dom';
import { setTempError, uiFinishLoading, uiStartLoading } from '../../actions/ui';
import { getClients } from '../../actions/consults';
import { staticURL } from '../../url';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { ClientShort } from '../clients/ClientShort';

export const BuyLot = () => {

    const dispatch = useDispatch();
    const { projectId, lotId } = useParams();
    const { lot, clients } = useSelector(state => state);

    const { state } = lot

    const initialForm = {
        depositAmount: '',
        lotPrice: lot.price,
        recordOpenedAt: '',

        // in case of reservation
        reservationDate: '',
        preReservationDate: '',
        preReservationAmount: '',

        // comission
        payedTo: '',
        amount: '',
        payedAt: '',

        //PENDING payed

        lapseToPay: ''
    }

    const [extraInfo, setExtraInfo] = useState({
        client: '',
        liquidate: false,

        // in case of reservation
        preReserved: state === 'preReserved' ? true : false,

        history: false,

        // payment ifo
        lapseType: '',
        paymentsDate: ''

    });

    const client = clients.find(c => c._id.toString() === extraInfo.client.toString());

    const [payments, setPayments] = useState([
        {
            amount: "",
            paymentDate: "",
            payedDate: ""
        }
    ]);


    const days = [
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
    ]

    const [formFields, onInputChange] = useForm(initialForm);

    const { depositAmount, lotPrice, recordOpenedAt, reservationDate, preReservationDate, preReservationAmount, payedTo, amount, payedAt, lapseToPay } = formFields;

    const [emptyFields, setEmptyFields] = useState([]);

    useEffect(() => {

        dispatch(redirectSet(redTypes.projects, `/proyectos/comprar/${projectId}/lote/${lotId}`));
        dispatch(getClients());

    }, [dispatch, projectId, lotId])


    const checkEmptyField = e => {

        if (e.target.value?.trim().length > 0) {
            const tempEmptyFields = emptyFields;

            if (tempEmptyFields.includes(e.target.name)) {
                const index = tempEmptyFields.indexOf(e.target.name);

                tempEmptyFields.splice(index, 1);
            }

            setEmptyFields(tempEmptyFields);
        }

    }

    const checkEmptyFields = () => {

        const tempEmptyFields = []

        for (let key in formFields) {
            if (key !== 'intNumber' && key !== 'matLastname' && key !== 'avMatLastname' && key !== 'maritalState' && key !== 'occupation' && key !== 'township' && key !== 'state' && key !== 'pob' && key !== 'dob' && key !== 'nationality') {
                if (formFields[key].toString().trim() === "") {
                    tempEmptyFields.push(key);
                    dispatch(setTempError('Los campos en rojo son obligatorios'))
                }
            }
        }


        setEmptyFields(tempEmptyFields);

        return tempEmptyFields.length === 0 ? false : true;
    }

    const submitPayment = async () => {

        const state = extraInfo.liquidate ? 'liquidated' : extraInfo.preReserved ? 'preReserved' : "reserved"

        const data = {
            customerId: extraInfo.client,
            projectId,
            lotId,
            state
        }

        if (payedTo.length > 1) {
            data.commissionInfo = {
                payedTo,
                amount: +amount,
                payedAt
            }
        }

        if (extraInfo.liquidate) {

            data.paymentInfo = {
                lotPrice,
                reservationDate
            }

        } else if (extraInfo.preReserved) {
            data.paymentInfo = {
                preReservationAmount: +preReservationAmount,
                preReservationDate,
                lotPrice: +lotPrice
            }

        } else if (extraInfo.history) {

            let counter = +depositAmount;



            data.payments =
                payments.map(p => {

                    counter += (+p.amount)

                    let type = 'payment'

                    if (+counter === +lotPrice) {
                        type = 'liquidation'
                    }

                    return {
                        amount: +p.amount,
                        ogPaymentDate: p.paymentDate,
                        payedAt: p.payedDate,
                        type
                    }
                })

            data.payments.push({
                amount: +depositAmount,
                payedAt: reservationDate,
                type: 'deposit'
            })

            data.paymentInfo = {
                depositAmount,
                minimumPaymentAmount: (+lotPrice - depositAmount) / (+lapseToPay),
                lotPrice,
                recordOpenedAt,
                reservationDate,
                paymentsDate: +extraInfo.paymentsDate,
                lapseType: extraInfo.lapseType,
                lapseToPay
            }

        } else {
            data.paymentInfo = {
                depositAmount,
                minimumPaymentAmount: (+lotPrice - depositAmount) / (+lapseToPay),
                lotPrice,
                recordOpenedAt,
                reservationDate,
                paymentsDate: +extraInfo.paymentsDate,
                lapseType: extraInfo.lapseType,
                lapseToPay
            }
        }

        console.log('esta es la data', data);

        dispatch(uiStartLoading());
        const res = await postData(data);
        dispatch(uiFinishLoading());

        // console.log(data);
        console.log(res);

    }

    const postData = data => {

        const url = `${staticURL}/records`

        console.log('pagando a: ', url);

        const res = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json();
            })
            .then((resData) => {
                console.log('resData', resData);
                return resData;
            })
            .catch(err => {
                console.log(err);
                // dispatch(uiFinishLoading());
            });

        return res;

    }

    const onPaymentChange = (e, index, key) => {

        const newPayments = payments.map(p => p);

        newPayments[index][key] = e.target.value;

        console.log(newPayments);

        setPayments(newPayments);

    }

    const addPayment = () => {

        const newPayment = {
            amount: "",
            paymentDate: "",
            payedDate: ""
        }

        setPayments([...payments, newPayment]);
        // dispatch(projectSet({ ...project, extraCharges: [...extraCharges, newPayment] }));

    }

    const deletePayment = index => {

        const newPayments = payments.map(p => p);
        newPayments.splice(index, 1);

        setPayments(newPayments);

    }

    const cancel = () => {

        const modalInfo = {
            title: 'Cancelar creación de cliente',
            text: null,
            link: `proyectos/ver/${projectId}/lote/${lotId}`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.projectCreate
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    return (
        <div className="pb-5 project create">
            <div className="project__header">
                <div className="left">
                    <h3> Compra de Lote </h3>
                </div>
                {
                    (state !== 'preReserved') && (
                        <div className="options" >


                            <input type="radio" value={false} onClick={() => setExtraInfo({ ...extraInfo, liquidate: false, history: false, preReserved: false })} id="enganche" name="action" defaultChecked />


                            <label htmlFor="enganche">
                                <div className="option">
                                    Pagar Enganche
                                </div>
                            </label>

                            <input type="radio" value={true} onClick={() => setExtraInfo({ ...extraInfo, liquidate: false, history: false, preReserved: true })} id="preReserve" name="action" />


                            <label htmlFor="preReserve">
                                <div className="option">
                                    Preapartar
                                </div>
                            </label>

                            <input type="radio" value={true} onClick={() => setExtraInfo({ ...extraInfo, history: false, preReserved: false, liquidate: true })} id="liquidate" name="action" />


                            <label htmlFor="liquidate">
                                <div className="option">
                                    Liquidar
                                </div>
                            </label>


                            <input type="radio" value={true} onClick={() => setExtraInfo({ ...extraInfo, history: true, preReserved: false, liquidate: false })} id="history" name="action" />


                            <label htmlFor="history">
                                <div className="option">
                                    Registrar Historial
                                </div>
                            </label>


                        </div>
                    )
                }

            </div>

            <div className="card edit mt-4">

                <div className="card__header">
                    <img src="../assets/img/payment.png" alt="" />
                    <h4>Información del pago</h4>
                </div>
                <div className="card__body">
                    <div className="right">
                        <div className={`card__body__item ${emptyFields.includes('lotPrice') && 'error'}`}>
                            <label htmlFor="lotPrice">Precio de Lote</label>
                            <input autoFocus name="lotPrice" type="number" autoComplete="off" onChange={onInputChange} value={lotPrice} />
                        </div>

                        {
                            !extraInfo.liquidate ? (
                                <>
                                    {
                                        (!extraInfo.preReserved) ? (
                                            <>
                                                <div className={`card__body__item ${emptyFields.includes('depositAmount') && 'error'}`}>
                                                    <label htmlFor="depositAmount">Enganche</label>
                                                    <input name="depositAmount" type="number" autoComplete="off" onChange={onInputChange} value={depositAmount} />
                                                </div>
                                                <div className={`card__body__item ${emptyFields.includes('recordOpenedAt') && 'error'}`}>
                                                    <label htmlFor="recordOpenedAt">Inicio de historial</label>
                                                    <input name="recordOpenedAt" type="date" autoComplete="off" onChange={onInputChange} value={recordOpenedAt} />
                                                </div>
                                                <div className={`card__body__item ${emptyFields.includes('reservationDate') && 'error'}`}>
                                                    <label htmlFor="reservationDate">Fecha de apartado</label>
                                                    <input name="reservationDate" type="date" autoComplete="off" onChange={onInputChange} value={reservationDate} />
                                                </div>

                                            </>
                                        ) : (
                                            <>
                                                <div className={`card__body__item ${emptyFields.includes('preReservationDate') && 'error'}`}>
                                                    <label htmlFor="preReservationDate">Fecha de preapartado</label>
                                                    <input name="preReservationDate" type="date" autoComplete="off" onChange={onInputChange} value={preReservationDate} />
                                                </div>
                                                <div className={`card__body__item ${emptyFields.includes('preReservationAmount') && 'error'}`}>
                                                    <label htmlFor="preReservationAmount">Cantidad de preapartado</label>
                                                    <input name="preReservationAmount" type="number" autoComplete="off" onChange={onInputChange} value={preReservationAmount} />
                                                </div>
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <div className={`card__body__item ${emptyFields.includes('reservationDate') && 'error'}`}>
                                    <label htmlFor="reservationDate">Fecha de compra</label>
                                    <input name="reservationDate" type="date" autoComplete="off" onChange={onInputChange} value={reservationDate} />
                                </div>
                            )
                        }

                    </div>
                    <div className="left">

                        {
                            !extraInfo.liquidate && (
                                <>
                                    {
                                        !extraInfo.preReserved && (
                                            <>

                                                <div className={`card__body__item ${emptyFields.includes('lapseType') && 'error'}`}>
                                                    <label >Tipo de Pagos</label>
                                                    <div className="options">

                                                        <input type="radio" name="lapseType" onClick={() => setExtraInfo({ ...extraInfo, lapseType: 'mensual' })} id="mensual" />
                                                        <label htmlFor="mensual">
                                                            Mensual
                                                        </label>

                                                        <input type="radio" name="lapseType" onClick={() => setExtraInfo({ ...extraInfo, lapseType: 'semanal' })} id="semanal" />
                                                        <label htmlFor="semanal">
                                                            Semanal
                                                        </label>
                                                    </div>
                                                </div>


                                                <div className={`card__body__item ${emptyFields.includes('paymentsDate') && 'error'}`}>
                                                    <label htmlFor="payDay" >Día de pago</label>
                                                    {
                                                        extraInfo.lapseType === 'semanal' ? (
                                                            <select onChange={e => setExtraInfo({ ...extraInfo, paymentsDate: e.target.value })} name="payDay" id="payDay">

                                                                {
                                                                    days.map(day => (
                                                                        <option key={day} value={day}>{day}</option>
                                                                    ))
                                                                }

                                                            </select>
                                                        ) : (
                                                            <input name="paymentsDay" type="number" autoComplete="off" onChange={e => setExtraInfo({ ...extraInfo, paymentsDate: e.target.value })} value={extraInfo.paymentsDate} />
                                                        )
                                                    }

                                                </div>

                                                {
                                                    extraInfo.lapseType.length > 2 && (
                                                        <div className={`card__body__item ${emptyFields.includes('lapseToPay') && 'error'}`}>
                                                            <label htmlFor="lapseToPay">Número de pagos</label>
                                                            <input name="lapseToPay" type="number" autoComplete="off" onChange={onInputChange} value={lapseToPay} />
                                                        </div>
                                                    )
                                                }

                                                {
                                                    (+lapseToPay > 0 && +depositAmount > 0) && (
                                                        <div className={`card__body__item`}>
                                                            <label htmlFor="lapseToPay">Cantidad por pago</label>
                                                            <p>{(+lotPrice - depositAmount) / (+lapseToPay)}</p>
                                                        </div>
                                                    )
                                                }

                                            </>
                                        )
                                    }
                                </>
                            )
                        }

                        <div className={`card__body__item ${emptyFields.includes('client') && 'error'}`}>
                            <label htmlFor="buyer">Cliente</label>
                            <select onChange={(e) => setExtraInfo({ ...extraInfo, client: e.target.value })} name="buyer" id="buyer">
                                <option value=""></option>
                                {
                                    clients?.map(c => {


                                        return (
                                            <option key={c.rfc} value={c._id}>{c.rfc}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                    </div>

                </div>
            </div>

            <div className="card-grid my-2">
                <div className="card edit">
                    <div className="card__header">
                        <img src="../assets/img/aval.png" alt="" />
                        <h4>Comisión</h4>
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('payedTo') && 'error'}`}>
                        <label htmlFor="payedTo">Asesor</label>
                        <input name="payedTo" type="text" autoComplete="off" onChange={onInputChange} value={payedTo} />
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('amount') && 'error'}`}>
                        <label htmlFor="amount">Comisión</label>
                        <input name="amount" type="number" autoComplete="off" onChange={onInputChange} value={amount} />
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('payedAt') && 'error'}`}>
                        <label htmlFor="payedAt">Fecha cuando fue pagada</label>
                        <input name="payedAt" type="date" autoComplete="off" onChange={onInputChange} value={payedAt} />
                    </div>
                </div>

                {
                    extraInfo.history && (
                        <div className="card edit">
                            <div className="card__header">
                                <img src="../assets/img/docs.png" alt="" />
                                <h4>Registro de pagos</h4>
                                <button onClick={addPayment} className="add-ref">Agregar pago</button>
                            </div>

                            {
                                payments.map((payment, index) => (
                                    <div key={index}>
                                        <div className="card__header mt-4">
                                            <h4>Pago {index + 1}</h4>
                                            {
                                                index !== 0 && (
                                                    <button onClick={() => deletePayment(index)} className="add-ref delete payment">&times;</button>
                                                )
                                            }
                                        </div>
                                        <div className={`card__body__item ${emptyFields.includes(`amount${index}`) && 'error'}`}>
                                            <label htmlFor={`amount${index}`}>Cantidad de pago</label>
                                            <input name={`amount${index}`} type="number" autoComplete="off" onChange={e => onPaymentChange(e, index, 'amount')} value={payment.amount} />
                                        </div>
                                        <div className={`card__body__item ${emptyFields.includes(`paymentDate${index}`) && 'error'}`}>
                                            <label htmlFor={`paymentDate${index}`}>Fecha programada</label>
                                            <input name={`paymentDate${index}`} type="date" autoComplete="off" onChange={e => onPaymentChange(e, index, 'paymentDate')} value={payment.paymentDate} />
                                        </div>
                                        <div className={`card__body__item ${emptyFields.includes(`payedDate${index}`) && 'error'}`}>
                                            <label htmlFor={`payedDate${index}`}>Fecha cuando fue pagado</label>
                                            <input name={`payedDate${index}`} type="date" autoComplete="off" onChange={e => onPaymentChange(e, index, 'payedDate')} value={payment.payedDate} />
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    )
                }

            </div>

            {
                client && (
                    <ClientShort client={client} />
                )
            }

            <div className="form-buttons">
                <button className="cancel" onClick={cancel} >
                    Cancelar
                </button>
                <button className="next" onClick={submitPayment}>
                    Realizar Pago
                </button>
            </div>

        </div>
    )
}
