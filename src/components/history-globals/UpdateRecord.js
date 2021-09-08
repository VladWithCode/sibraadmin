import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { floatingButtonSet } from '../../actions/floatingButton';
import { historyPostUpdate, historySetRecordInfo } from '../../actions/historyActions';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';
import { ClientShort } from '../clients/ClientShort';
import { ExtraPaymentsEdit } from './ExtraPaymentsEdit';
import { PaymentsEdit } from './PaymentsEdit';

const days = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
]

export const UpdateRecord = () => {

    const dispatch = useDispatch();
    const { recordId } = useParams();

    const { records, historyActions: { lot: currentLot, record }, clients } = useSelector(state => state);

    const { area, isCorner, lotNumber, measures, manzana, price } = currentLot;

    const currentClient = clients.find(c => c._id === currentLot.record?.customer);

    const currentRecord = records.find(r => r._id === recordId);

    const [emptyFields, setEmptyFields] = useState([]);

    const [formValues, setFormValues] = useState({
        payments: record.payments,
        extraCharges: record.extraCharges,
        paymentInfo: {
            lapseToPay: record.paymentInfo.lapseToPay,
            lapseType: record.paymentInfo.lapseType,
            paymentsDate: record.paymentInfo.paymentsDate
        }
    });

    const { paymentInfo, paymentInfo: { lapseToPay, lapseType, paymentsDate } } = formValues;

    const minimumPaymentAmount = ((+currentRecord?.paymentInfo.lotPrice - +currentRecord?.paymentInfo.depositAmount) / +(lapseToPay)).toLocaleString();

    useEffect(() => {

        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.history, `/historial/editar/${recordId}`));

        setFormValues({
            payments: record.payments,
            extraCharges: record.extraCharges,
            paymentInfo: {
                lapseToPay: record.paymentInfo.lapseToPay,
                lapseType: record.paymentInfo.lapseType,
                paymentsDate: record.paymentInfo.paymentsDate
            }
        })

    }, [dispatch, recordId, record]);

    console.log('estos son los formValues: ', currentRecord);

    const checkEmptyField = e => {

        const tempEmptyFields = emptyFields;

        if (e.target.value?.trim().length > 0) {


            if (tempEmptyFields.includes(e.target.name)) {
                const index = tempEmptyFields.indexOf(e.target.name);

                tempEmptyFields.splice(index, 1);
            }


        } else {
            tempEmptyFields.push(e.target.name);
        }

        setEmptyFields(tempEmptyFields);

    }

    const cancel = () => {

        const modalInfo = {
            title: 'Cancelar edición',
            text: '¿Desea cancelar la edición del historial?',
            link: `/historial`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.history
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    const onInputChange = (input, value) => {

        let tempFormValues = input.target ?
            {
                ...formValues,
                paymentInfo: {
                    ...paymentInfo,
                    [input.target.name]: input.target.value
                }
            }
            :
            {
                ...formValues,
                paymentInfo: {
                    ...paymentInfo,
                    [input]: value
                }
            }

        if (input.target) {
            checkEmptyField(input);

            if (input.target.name === 'lapseType') {
                tempFormValues.paymentInfo.paymentsDate = input.target.name === 'mensual' ? '10' : 'lunes'
            }
        }




        setFormValues(tempFormValues);
        dispatch(historySetRecordInfo(tempFormValues));

    }

    return (
        <div className="pb-5 project create">
            <div className="project__header">
                <div className="left">
                    <h3> Editar historial </h3>
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

            <div className="project__header">
                <div className="left">
                    <h3> Historial Original </h3>
                </div>
            </div>

            <div className="card mt-2">

                <div className="card__header">
                    <img src="../assets/img/info.png" alt="" />
                    <h4>Información del historial</h4>
                </div>
                <div className="card__body">
                    <div className="right">

                        <div className="card__body__item">
                            <span>número de pagos</span>
                            <p> {currentRecord?.paymentInfo.lapseToPay} </p>
                        </div>
                        <div className="card__body__item">
                            <span>Tipo de pagos</span>
                            <p> {currentRecord?.paymentInfo.lapseType} </p>
                        </div>
                        <div className="card__body__item">
                            <span>día de pago</span>
                            <p> {currentRecord?.paymentInfo.paymentsDate} </p>
                        </div>
                        <div className="card__body__item">
                            <span>cantidad por pago</span>
                            <p> ${currentRecord?.paymentInfo.minimumPaymentAmount.toLocaleString()} </p>
                        </div>


                    </div>
                    <div className="left">

                        <div className="card__body__item">
                            <span >Precio del lote</span>
                            <p className="price"> ${currentRecord?.paymentInfo.lotPrice.toLocaleString()} </p>
                        </div>

                        <div className="card__body__item">
                            <span>pagado</span>
                            <p className="payed"> ${currentRecord?.paymentInfo.lotAmountPayed.toLocaleString()} </p>
                        </div>

                        <div className="card__body__item">
                            <span>deuda restante</span>
                            <p className="debt"> ${currentRecord?.paymentInfo.lotAmountDue.toLocaleString()} </p>
                        </div>

                    </div>

                </div>
            </div>

            <div className="project__header">
                <div className="left">
                    <h3> Historial Editado </h3>
                </div>
            </div>

            <div className="card-grid">
                <div className="card edit mt-2">

                    <div className="card__header">
                        <img src="../assets/img/info.png" alt="" />
                        <h4>Información Editable</h4>
                    </div>
                    <div className="card__body">
                        <div className="full">

                            <div className={`card__body__item ${emptyFields.includes('lapseToPay') && 'error'}`}>
                                <label htmlFor="lapseToPay">numero de pagos
                                </label>
                                <input autoFocus name="lapseToPay" type="number" autoComplete="off" value={lapseToPay} onChange={onInputChange} />
                            </div>

                            <div className={`card__body__item ${emptyFields.includes('lapseType') && 'error'}`}>
                                <label >Tipo de Pagos</label>
                                <div className="options">

                                    {
                                        lapseType === 'mensual' ?
                                            (
                                                <>
                                                    <input type="radio" name="lapseType" onClick={onInputChange} id="mensual" value="mensual" defaultChecked />
                                                    <label htmlFor="mensual">
                                                        Mensual
                                                    </label>

                                                    <input type="radio" name="lapseType" onClick={onInputChange} id="semanal" value="semanal" />
                                                    <label htmlFor="semanal">
                                                        Semanal
                                                    </label>
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <input type="radio" name="lapseType" onClick={onInputChange} id="mensual" value="mensual" />
                                                    <label htmlFor="mensual">
                                                        Mensual
                                                    </label>

                                                    <input type="radio" name="lapseType" onClick={onInputChange} id="semanal" value="semanal" defaultChecked />
                                                    <label htmlFor="semanal">
                                                        Semanal
                                                    </label>
                                                </>
                                            )
                                    }

                                </div>
                            </div>

                            <div className={`card__body__item ${emptyFields.includes('paymentsDate') && 'error'}`}>
                                <label htmlFor="payDay" >Día de pago</label>
                                {
                                    lapseType === 'semanal' ? (
                                        <select onChange={e => onInputChange('paymentsDate', e.target.value)} name="payDay" id="payDay">

                                            {
                                                days.map(day => (
                                                    <option key={day} name={day} value={day}>{day}</option>
                                                ))
                                            }

                                        </select>
                                    ) : (
                                        <input name="paymentsDate" type="number" autoComplete="off" value={paymentsDate} onChange={onInputChange} />
                                    )
                                }

                            </div>

                            <div className="card__body__item">
                                <span>cantidad por pago</span>
                                <p> ${minimumPaymentAmount} </p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            {
                record.payments && (
                    <PaymentsEdit recordId={recordId} />
                )
            }

            {
                record.extraCharges.length > 0 && (
                    <ExtraPaymentsEdit recordId={recordId} />
                )
            }



            <div className="form-buttons">
                <button className="cancel" onClick={cancel} >
                    Cancelar
                </button>
                <button className="next" onClick={() => dispatch(historyPostUpdate(record))}>
                    Guardar cambios
                </button>
            </div>

        </div>
    )
}
