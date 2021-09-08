import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { floatingButtonSet } from '../../actions/floatingButton';
import { historyGetLot } from '../../actions/historyActions';
import { getLot } from '../../actions/lot';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { setTempError, uiFinishLoading, uiStartLoading } from '../../actions/ui';
import { redTypes } from '../../types/reduxTypes';
import { staticURL } from '../../url';
import { ClientShort } from '../clients/ClientShort';
import { Record } from '../history-globals/Record';


const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}


export const Payment = () => {

    const dispatch = useDispatch();
    const { projectId, lotId } = useParams();

    const { historyActions: { lot: currentLot }, clients } = useSelector(state => state);

    const { record } = currentLot;

    const currentClient = clients.find(c => c._id === record?.customer);

    const [prorogation, setProrogation] = useState();


    useEffect(() => {

        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.history, `/historial/abonar/${projectId}/lote/${lotId}`));
        dispatch(historyGetLot(lotId));

    }, [dispatch, projectId, lotId]);

    const [emptyFields, setEmptyFields] = useState([]);

    const [formValues, setFormValues] = useState({
        amount: '',
        type: '',
        markAsNextPayment: false,
        prorogateTo: ''
    })

    const { amount, markedAsNextPayment, prorogateTo } = formValues;

    const inputChange = e => {
        checkEmptyField(e);
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    }

    const pay = async () => {

        if (+amount === 0) {
            const tempEmptyFields = emptyFields;

            if (tempEmptyFields.includes('amount')) {
                const index = tempEmptyFields.indexOf('amount');

                tempEmptyFields.splice(index, 1);
            } else {
                tempEmptyFields.push('amount');
            }

            setEmptyFields(tempEmptyFields);
            dispatch(setTempError('Debe ingresar una cantidad de pago'));

            return;
        }

        const data = {
            type: +amount >= record.paymentInfo.lotAmountDue ? 'liquidation' : 'payment',
            amount: +amount,
            markedAsNextPayment
        }

        dispatch(uiStartLoading());

        const res = await postPayment(data);

        dispatch(uiFinishLoading());

        console.log(res);

        if (res) {
            if (res.status === 'OK') {
                const modalInfo = {
                    title: `Pago realizado con éxito`,
                    text: `pago por la cantidad de $${amount}`,
                    link: `/historial`,
                    okMsg: 'Continuar',
                    closeMsg: null,
                    type: redTypes.history
                }

                dispatch(modalUpdate(modalInfo));
                dispatch(modalEnable());
                dispatch(getLot(lotId));

            } else {
                dispatch(setTempError('Hubo un problema con la base de datos'));

                return;
            }
        }

    }

    const postPayment = data => {

        const url = `${staticURL}/records/${record._id}/payment`;

        console.log('haciendo post jejeje', url);

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
            .then((data) => {
                return data;
            })
            .catch(err => {
                console.log(err);
                // dispatch(uiFinishLoading());
            });

        return res;

    }

    const postProrogation = async () => {

        if (prorogateTo === '') {
            const tempEmptyFields = emptyFields;

            if (tempEmptyFields.includes('prorogateTo')) {
                const index = tempEmptyFields.indexOf('prorogateTo');

                tempEmptyFields.splice(index, 1);
            } else {
                tempEmptyFields.push('prorogateTo');
            }

            setEmptyFields(tempEmptyFields);
            dispatch(setTempError('Debe ingresar una fecha para la prórroga'));

            return;
        }

        const data = {
            prorogateTo
        }

        console.log("esta es la fecha", data);

        const url = `${staticURL}/records/${record._id}/prorogate`;

        dispatch(uiStartLoading());

        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                return data;
            })
            .catch(err => {
                console.log(err);
                // dispatch(uiFinishLoading());
            });

        if (res) {
            if (res.status === 'OK') {
                const modalInfo = {
                    title: `Prórroga programada con éxito`,
                    text: `El pago se ha programado para el ${new Date(prorogateTo).toLocaleDateString('es-MX', dateOptions)}`,
                    link: `/historial`,
                    okMsg: 'Continuar',
                    closeMsg: null,
                    type: redTypes.history
                }

                dispatch(modalUpdate(modalInfo));
                dispatch(modalEnable());
                dispatch(getLot(lotId));

            } else {
                dispatch(setTempError('Hubo un problema con la base de datos'));

                return;
            }
        }

        dispatch(uiFinishLoading());

    }

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



    const cancel = () => {

        const modalInfo = {
            title: 'Cancelar pago',
            text: '¿Desea cancelar el pago del lote?',
            link: `/historial`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.history
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }


    return (
        <div className="pb-5 project create">
            <div className="project__header">
                <div className="left">
                    <h3> Pagar lote </h3>
                </div>

                <div className="options" >

                    {
                        prorogation ? (
                            <input type="checkbox" value={true} onClick={() => setProrogation(!prorogation)} id="preReserve" name="action" defaultChecked />
                        ) : (
                            <input type="checkbox" value={true} onClick={() => setProrogation(!prorogation)} id="preReserve" name="action" />
                        )
                    }

                    <label htmlFor="preReserve">
                        <div className="option">
                            Solicitar prórroga
                        </div>
                    </label>

                </div>
            </div>




            <div className="card edit my-2">

                <div className="card__header">
                    <img src="../assets/img/payment.png" alt="" />
                    <h4>Información del pago</h4>
                </div>
                <div className="card__body">
                    <div className="right">

                        {
                            prorogation ? (
                                <div className={`card__body__item ${emptyFields.includes('prorogateTo') && 'error'}`}>
                                    <label htmlFor="prorogateTo">Fecha límite de pago</label>
                                    <input autoFocus name="prorogateTo" type="date" autoComplete="off" value={prorogateTo} onChange={inputChange} />
                                </div>
                            )
                                :
                                (
                                    <>
                                        <div className={`card__body__item ${emptyFields.includes('amount') && 'error'}`}>
                                            <label htmlFor="amount">Cantidad del pago</label>
                                            <input autoFocus name="amount" type="number" autoComplete="off" value={amount} onChange={inputChange} />
                                        </div>

                                        <div className={`card__body__item ${emptyFields.includes('markedAsNextPayment') && 'error'}`}>
                                            <label >acción</label>
                                            <div className="options">

                                                <input type="radio" name="markedAsNextPayment" onClick={() => setFormValues({ ...formValues, amount: record.paymentInfo.minimumPaymentAmount, markedAsNextPayment: true })} id="no" />
                                                <label htmlFor="no">
                                                    Pagar mensualidad
                                                </label>

                                                <input defaultChecked type="radio" name="markedAsNextPayment" onClick={() => setFormValues({ ...formValues, amount: '', markedAsNextPayment: false })} id="yes" />
                                                <label htmlFor="yes">
                                                    Abonar
                                                </label>
                                            </div>
                                        </div>
                                    </>
                                )
                        }




                    </div>
                    <div className="left">



                    </div>

                </div>
            </div>

            {
                record._id && (
                    <Record record={record} payment={true} />
                )
            }

            {
                currentClient && (
                    <ClientShort client={currentClient} />
                )
            }

            <div className="form-buttons">
                <button className="cancel" onClick={cancel} >
                    Cancelar
                </button>
                <button className="next" onClick={() => prorogation ? postProrogation() : pay()}>
                    Realizar Pago
                </button>
            </div>
        </div>
    )
}
