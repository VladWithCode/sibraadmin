import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { setTempError } from '../../actions/ui';
import { redTypes } from '../../types/reduxTypes';
import { staticURL } from '../../url';

export const Payment = () => {

    const dispatch = useDispatch();
    const { projectId, lotId } = useParams();

    const { lot: currentLot } = useSelector(state => state);

    const { area, isCorner, lotNumber, measures, manzana, price, record } = currentLot;

    const { paymentInfo: { minimumPaymentAmount } } = record;

    useEffect(() => {

        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.projects, `/proyectos/abonar/${projectId}/lote/${lotId}`));

    }, [dispatch, projectId, lotId]);

    const [emptyFields, setEmptyFields] = useState([]);

    const [formValues, setFormValues] = useState({
        amount: '',
        type: '',
        markAsNextPayment: false
    })

    const { amount, type, markAsNextPayment } = formValues;

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

        const url = `${staticURL}/records/${record}`;

        const data = await fetch(url)
            .then(res => res.json())
            .then(d => d)
            .catch(err => err)

        console.log(data);

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
            title: 'Cancelar creación de cliente',
            text: null,
            link: `/proyectos/ver/${projectId}/lote/${lotId}`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.clientEdit
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

            <div className="card">
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
                            <p className="price"> ${price.toLocaleString()} </p>
                        </div>

                    </div>
                    <div className="left">
                        <h4>Medidas</h4>
                        {
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
                        }

                    </div>
                </div>
            </div>

            <div className="card edit mt-4">

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

                                <input type="radio" name="markedAsNextPayment" onClick={() => setFormValues({ ...formValues, amount: minimumPaymentAmount, markedAsNextPayment: true })} id="no" />
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

            {/* <div className="options" >


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


            </div> */}

        </div>
    )
}
