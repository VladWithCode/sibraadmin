import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { floatingButtonSet } from '../../actions/floatingButton';
import { getLot } from '../../actions/lot';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { setTempError, uiFinishLoading, uiStartLoading } from '../../actions/ui';
import { redTypes } from '../../types/reduxTypes';
import { staticURL } from '../../url';
import { ClientShort } from '../clients/ClientShort';

export const Payment = () => {

    const dispatch = useDispatch();
    const { projectId, lotId } = useParams();

    const { historyActions: { lot: currentLot }, clients } = useSelector(state => state);

    const { area, isCorner, lotNumber, measures, manzana, price, record } = currentLot;

    const currentClient = clients.find(c => c._id === record?.customer);


    useEffect(() => {

        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.history, `/historial/abonar/${projectId}/lote/${lotId}`));

    }, [dispatch, projectId, lotId]);

    const [emptyFields, setEmptyFields] = useState([]);

    const [formValues, setFormValues] = useState({
        amount: '',
        type: '',
        markAsNextPayment: false
    })

    const { amount, markedAsNextPayment } = formValues;

    const inputChange = e => {
        checkEmptyField(e);
        setFormValues({ ...formValues, amount: e.target.value });
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
            </div>

            <div className="card mb-2">
                <div className="card__header">
                    <img src="../assets/img/lots.png" alt="" />
                    <h4>Información General del Lote</h4>
                </div>
                <div className="card__body">
                    <div className="right">
                        <div className="card__body__item">
                            <span>Número de Lote</span>
                            <p> {lotNumber} </p>
                        </div>
                        <div className="card__body__item">
                            <span>Número de Manzana</span>
                            <p> {manzana} </p>
                        </div>
                        <div className="card__body__item">
                            <span>Esquina</span>
                            <p> {isCorner ? 'Sí' : 'No'} </p>
                        </div>
                        <div className="card__body__item">
                            <span>Área</span>
                            <p> {area}m<sup>2</sup> </p>
                        </div>
                        <div className="card__body__item">
                            <span >Precio</span>
                            <p className="price"> ${price?.toLocaleString()} </p>
                        </div>

                    </div>
                    <div className="left">
                        <h4>Medidas</h4>

                        {
                            measures && (
                                measures.length > 0 && (

                                    measures.map((measure) => (
                                        <div key={measure._id} className="card__body__item">
                                            <span>
                                                {measure.title}
                                            </span>
                                            <p>
                                                {measure.value}m<sup>2</sup>
                                            </p>
                                        </div>
                                    )
                                    )

                                )
                            )
                        }


                    </div>
                </div>
            </div>

            {
                currentClient && (
                    <ClientShort client={currentClient} />
                )
            }

            <div className="card edit mt-2">

                <div className="card__header">
                    <img src="../assets/img/payment.png" alt="" />
                    <h4>Información del pago</h4>
                </div>
                <div className="card__body">
                    <div className="right">

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


                    </div>
                    <div className="left">



                    </div>

                </div>
            </div>



            <div className="form-buttons">
                <button className="cancel" onClick={cancel} >
                    Cancelar
                </button>
                <button className="next" onClick={pay}>
                    Realizar Pago
                </button>
            </div>
        </div>
    )
}
