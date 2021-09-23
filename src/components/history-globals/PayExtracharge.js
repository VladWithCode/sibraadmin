import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { extraPaymentSetInfo, paymentSetInfo } from '../../actions/payments';
import { redirectSet } from '../../actions/redirect';
import { setTempError, setTempSuccessNotice, uiFinishLoading, uiStartLoading } from '../../actions/ui';
import { redTypes } from '../../types/reduxTypes';
import { staticURL } from '../../url';
import { ClientShort } from '../clients/ClientShort';
import { TextEditor } from '../templates/TextEditor';

export const PayExtraCharge = () => {

    const dispatch = useDispatch();
    const { extraChargeId, recordId } = useParams();

    const { historyActions: { lot: currentLot }, clients, projects, payments } = useSelector(state => state);

    const { area, isCorner, lotNumber, measures, manzana, price, record } = currentLot;

    const currentClient = clients.find(c => c._id === record?.customer);

    // const { extraCharges } = projects.find(p => p._id === record?.project);

    // const currentExtraCharges = extraCharges.find(e => e._id === extraChargeId);

    const [currentExtraCharges, setCurrentExtraCharges] = useState({});

    // const { amount: extraAmount, title } = currentExtraCharges;

    const [emptyFields, setEmptyFields] = useState([]);

    const [formValues, setFormValues] = useState(payments);

    const { amount1, date, payer1, editTemplate, templates } = formValues;

    // const currentTemplate = templates.find(t => t.type === (currentExtraCharges?.title.toLowerCase() === 'escrituras' ? 'ESCRITURAS' : 'CARGO'));

    const [currentTemplate, setCurrentTemplate] = useState(templates.find(t => t.type === (currentExtraCharges?.title?.toLowerCase() === 'escrituras' ? 'ESCRITURAS' : 'CARGO')))

    useEffect(() => {

        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.history, `/historial/extras/abonar/${extraChargeId}/${recordId}`));

        setFormValues(payments);

    }, [dispatch, extraChargeId, recordId, payments]);

    useEffect(() => {

        const currentProject = projects.find(p => p._id === record?.project);

        const currentExtraCharges = currentProject?.extraCharges.find(e => e._id === extraChargeId);

        setCurrentExtraCharges(currentExtraCharges);
        setCurrentTemplate(templates.find(t => t.type === (currentExtraCharges?.title?.toLowerCase() === 'escrituras' ? 'ESCRITURAS' : 'CARGO')))

    }, [extraChargeId, projects, record?.project, templates])


    const inputChange = e => {
        checkEmptyField(e);
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
        dispatch(extraPaymentSetInfo({ ...formValues, [e.target.name]: e.target.value }))
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
            title: 'Cancelar pago de cargo extra',
            text: null,
            link: `/historial`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.history
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    const pay = async () => {

        if (+amount1 === 0) {
            const tempEmptyFields = emptyFields;

            if (tempEmptyFields.includes('amount1')) {
                const index = tempEmptyFields.indexOf('amount1');

                tempEmptyFields.splice(index, 1);
            } else {
                tempEmptyFields.push('amount1');
            }

            setEmptyFields(tempEmptyFields);
            dispatch(setTempError('Debe ingresar una cantidad de pago'));

            return;
        }

        // const templateContent = draftToHtml(convertToRaw(currentTemplate.state.editorState.getCurrentContent())).replaceAll(' ', '&nbsp;');

        const exp = new RegExp(/<([a-z]+)\s?(style=".*?")?>(<([a-z]+)\s?(style=".*?")?>(.*?)<\/\4>)<\/\1>/gi);

        const strContent = currentTemplate && draftToHtml(convertToRaw(currentTemplate.state.editorState.getCurrentContent()));

        const tempContent = strContent?.replace(exp, (str, g1, g2, g3, g4, g5, g6) => {

            return `<${g1}${g2 ? ' ' + g2 : ''}>${!g3 ? '' : `<${g4}${g5 ? ' ' + g5 : ''}>${g6.replaceAll(' ', '&nbsp;')}</${g4}>`}</${g1}>`
        })

        const templateContent = tempContent?.replaceAll('<p></p>', '<p><br></p>');

        const data = {
            amount: +amount1,
            date: date || null,
            payer: payer1 ? (payer1.trim().length > 3 || null) : null,
            content: editTemplate ? templateContent : null
        }

        dispatch(uiStartLoading());

        const res = await postPayment(data);

        dispatch(uiFinishLoading());

        if (res) {
            if (res.status === 'OK') {
                const modalInfo = {
                    title: `Pago realizado con éxito`,
                    text: `pago por la cantidad de $${amount1}`,
                    link: `/historial`,
                    okMsg: 'Continuar',
                    closeMsg: null,
                    type: redTypes.history
                }

                dispatch(modalUpdate(modalInfo));
                dispatch(modalEnable());

            } else {
                dispatch(setTempError('Hubo un problema con la base de datos'));

                return;
            }
        }

    }

    const postPayment = data => {

        const url = `${staticURL}/records/${record._id}/charge/${extraChargeId}/pay`;

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

    const handleCopy = ({ target }) => {

        navigator.clipboard.writeText(`%%${target.id.toUpperCase()}%%`);

        dispatch(setTempSuccessNotice(`Variable ${target.id} copiada al porta papeles`))

    }

    return (
        <div className="pb-5 project create">
            <div className="project__header">
                <div className="left">
                    <h3> Abono a Cargo Extra </h3>
                </div>
            </div>

            <div className="card edit mt-2">

                <div className="card__header">
                    <img src="../assets/img/payment.png" alt="" />
                    <h4>Información del pago</h4>
                </div>
                <div className="card__body">
                    <div className="right">

                        <div className={`card__body__item ${emptyFields.includes('amount1') && 'error'}`}>
                            <label htmlFor="amount1">Cantidad del pago</label>
                            <input autoFocus name="amount1" type="number" autoComplete="off" value={amount1} onChange={inputChange} />
                        </div>



                        <div className={`card__body__item ${emptyFields.includes('date') && 'error'}`}>
                            <label htmlFor="date">Fecha del pago</label>
                            <input autoFocus name="date" type="date" autoComplete="off" value={date} onChange={inputChange} />
                        </div>



                        <div className={`card__body__item ${emptyFields.includes('payer1') && 'error'}`}>
                            <label htmlFor="payer1">Quién paga</label>
                            <input autoFocus name="payer1" type="text" autoComplete="off" value={payer1} onChange={inputChange} />
                        </div>

                    </div>
                </div>
            </div>

            <div className="project__header">
                <div className="left"></div>

                {

                    <div className="options" >

                        {
                            editTemplate ? (
                                <input className="ok" type="checkbox" value={true} onClick={() => {
                                    setFormValues(fv => ({
                                        ...fv,
                                        editTemplate: !editTemplate
                                    }));
                                    dispatch(paymentSetInfo({ ...formValues, editTemplate: !editTemplate }))
                                }} id="editTemplate" defaultChecked />
                            ) : (
                                <input className="ok" type="checkbox" value={false} onClick={() => {
                                    setFormValues(fv => ({
                                        ...fv,
                                        editTemplate: !editTemplate
                                    }));
                                    dispatch(paymentSetInfo({ ...formValues, editTemplate: !editTemplate }))
                                }} id="editTemplate" />
                            )
                        }

                        <label htmlFor="editTemplate">
                            <div className="option">
                                Editar recibo
                            </div>
                        </label>

                    </div>

                }

            </div>

            {
                (editTemplate && currentTemplate) && (

                    <div className="card">
                        <div className="card__body">

                            <div className="paraphs">

                                <TextEditor template={currentTemplate} payment={true} />
                                <div className="my-3"></div>

                            </div>
                            <div className="variables">

                                <h4>Variables de la plantilla</h4>

                                {
                                    currentTemplate.variables.sort().map(variable => (
                                        <p onClick={handleCopy} id={variable.title} >{variable.title}</p>
                                    ))
                                }

                            </div>
                        </div>
                    </div>

                )
            }

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

            <div className="card my-2">
                <div className="card__header">
                    <img src="../assets/img/services.png" alt="" />
                    <h4>Cargo extra</h4>
                </div>
                <div className="card__body">
                    <div className="right">
                        <div className="card__body__item">
                            <span>Nombre del cargo</span>
                            <p> {currentExtraCharges?.title} </p>
                        </div>
                        <div className="card__body__item">
                            <span>Precio del cargo</span>
                            <p> ${currentExtraCharges?.amount?.toLocaleString()} </p>
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
