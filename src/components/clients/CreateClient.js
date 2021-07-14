import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { floatingButtonSet } from '../../actions/floatingButton';
import { redTypes } from '../../types/reduxTypes';
import { redirectSet } from '../../actions/redirect';
import { clientSet } from '../../actions/client';
import { setTempError, setTempWarning, uiStartLoading, uiFinishLoading } from '../../actions/ui';

export const CreateClient = () => {

    const dispatch = useDispatch();

    const { clients } = useSelector(state => state);

    const initialForm = {
        names: '',
        patLastname: '',
        matLastname: '',
        _id: '',
        curp: '',
        email: '',
        phoneNumber: '',
        col: '',
        street: '',
        zip: '',
        extNumber: '',
        intNumber: '',
        avNames: '',
        avPatLastname: '',
        avMatLastname: '',
        avPhoneNumber: ''
    }

    const [formFields, handleInputChange] = useForm(initialForm);

    const { names, patLastname, matLastname, _id, curp, email, phoneNumber, col, street, zip, extNumber, intNumber, avNames, avMatLastname, avPatLastname, avPhoneNumber } = formFields;

    const [emptyFields, setEmptyFields] = useState([]);

    const [isWrong, setIsWrong] = useState([]);

    useEffect(() => {

        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.clients, `/clientes/nuevo`));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // FUNCTIONS

    const handleChange = e => {
        handleInputChange(e);
        checkEmptyField(e);
    }

    const cancel = () => {

        const modalInfo = {
            title: 'Cancelar creación de cliente',
            text: null,
            link: '/clientes',
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.clientEdit
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    const handleCreateClient = async () => {

        if (isWrong.length > 0) {
            dispatch(setTempWarning('Hay campos con información inválida'))
        }

        if (isFormValid() && isWrong.length === 0) {

            dispatch(uiStartLoading());

            const client = {
                names,
                patLastname,
                matLastname,
                _id,
                curp,
                email,
                phoneNumber,
                address: {
                    col,
                    street,
                    intNumber,
                    extNumber,
                    zip
                },
                aval: {
                    names: avNames,
                    patLastname: avPatLastname,
                    matLastname: avMatLastname,
                    phoneNumber: avPhoneNumber
                }
            }

            const res = await uploadClient(client);

            console.log('respuesta', res);
            dispatch(uiFinishLoading());

            if (res.status === 'OK') {
                const modalInfo = {
                    title: `Cliente ${names} registrado con éxito`,
                    text: 'Continúa para agregar documentos',
                    link: `/clientes/docs/${res.customer._id}`,
                    okMsg: 'Continuar',
                    closeMsg: null,
                    type: redTypes.clientEdit
                }

                dispatch(modalUpdate(modalInfo));
                dispatch(modalEnable());
                dispatch(clientSet(res.customer));

            } else if (res.err?.code === 11000) {
                const repeated = isDuplicated(client);
                const { isRepeated, key, dispName } = repeated;
                console.log(repeated);

                if (isRepeated) {
                    setEmptyFields([key]);
                    dispatch(setTempError(`Ya hay un cliente con el mismo ${dispName}`));
                }

            }

            // dispatch(redirectSet(redTypes.clients, `/clientes/docs`));
        }

    }

    const isDuplicated = (customer) => {
        const { phoneNumber, _id, curp, email } = customer;

        let key, dispName, isRepeated = false;

        // console.log(customer);

        clients.forEach(client => {
            if (client.phoneNumber === +phoneNumber) {
                key = 'phoneNumber';
                dispName = 'Número de contacto';
                isRepeated = true;
            }
            if (client._id === _id) {
                key = 'rfc';
                dispName = 'RFC';
                isRepeated = true;
            }
            if (client.curp === curp) {
                key = 'curp';
                dispName = 'CURP';
                isRepeated = true;
            }
            if (client.email === email) {
                key = 'email';
                dispName = 'Email';
                isRepeated = true;
            }
        });

        return {
            isRepeated,
            key,
            dispName
        }

    }

    const isFormValid = () => {

        checkEmptyFields();
        isEmailValid(email);
        isNumberValid(avPhoneNumber, 'avPhoneNumber');
        isNumberValid(phoneNumber, 'phoneNumber')

        if (checkEmptyFields(formFields)) {
            return false;
        }

        if (!isNumberValid(phoneNumber, 'phoneNumber') || !isNumberValid(avPhoneNumber, 'avPhoneNumber') || !isEmailValid(email) || checkEmptyFields(formFields)) {
            return false;
        }

        return true;
    }

    const checkEmptyFields = () => {

        const tempEmptyFields = []

        for (let key in formFields) {
            if (key !== 'intNumber' && key !== 'matLastname' && key !== 'avMatLastname') {
                if (formFields[key].trim() === "") {
                    tempEmptyFields.push(key);
                    dispatch(setTempError('Los campos en rojo son obligatorios'))
                }
            }
        }

        setEmptyFields(tempEmptyFields);

        return tempEmptyFields.length === 0 ? false : true;
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

    const isEmailValid = email => {

        const expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        const isValid = expReg.test(email.toLowerCase());
        const wrongFields = isWrong;

        if (isValid) {
            if (wrongFields.includes('email')) {
                const index = wrongFields.indexOf('email');
                wrongFields.splice(index, 1);
            }

        } else {
            if (!wrongFields.includes('email')) {
                wrongFields.push('email');
            }

            dispatch(setTempWarning('Correo Electrónico no válido'));
        }

        setIsWrong(wrongFields);

        return isValid;

    }

    const isNumberValid = (number, name) => {
        const isValid = number.length === 10 ? true : false;

        const wrongFields = isWrong;

        if (isValid) {
            if (wrongFields.includes(name)) {
                const index = wrongFields.indexOf(name);
                wrongFields.splice(index, 1);
            }

        } else {
            if (!wrongFields.includes(name)) {
                wrongFields.push(name);
            }

        }

        setIsWrong(wrongFields);
        return isValid;
    }

    const uploadClient = (client) => {

        const data = {
            doc: client
        }

        console.log(data);

        console.log('Subiendo cliente');

        const url = 'http://192.168.1.66:3000/api/customers/';

        // dispatch(uiStartLoading());

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
                console.log('data', data);
                return data;
            })
            .catch(err => {
                console.log(err);
                // dispatch(uiFinishLoading());
            });

        return res;

    }

    return (
        <div className="pb-5 project create">
            <div className="project__header">
                <div className="left">
                    <h3> Registro de Cliente </h3>
                </div>
                {/* <div className="right">
                    Número de cliente {clients.length + 1}
                </div> */}
            </div>

            <div className="card edit mt-4">
                <div className="card__header">
                    <img src="../assets/img/user.png" alt="" />
                    <h4>Información General del Cliente</h4>
                </div>
                <div className="card__body">
                    <form className="right">
                        <div className={`card__body__item ${emptyFields.includes('names') && 'error'}`}>
                            <label htmlFor="names">Nombre(s)</label>
                            <input autoFocus name="names" onChange={handleChange} value={names} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('patLastname') && 'error'}`}>
                            <label htmlFor="patLastname">Apellido Paterno</label>
                            <input name="patLastname" onChange={handleChange} value={patLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('matLastname') && 'error'}`}>
                            <label htmlFor="matLastname">Apellido Materno</label>
                            <input name="matLastname" onChange={handleChange} value={matLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('_id') && 'error'}`}>
                            <label htmlFor="_id">RFC</label>
                            <input minLength="12" maxLength="13" name="_id" onChange={handleChange} value={_id} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('curp') && 'error'}`}>
                            <label htmlFor="curp">CURP</label>
                            <input minLength="18" maxLength="18" name="curp" onChange={handleChange} value={curp} type="text" autoComplete="off" />
                        </div>
                        <div className="mt-4 card__header">
                            <h4>Información de contacto</h4>
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('email') && 'error'} ${isWrong.includes('email') && 'warning'}`}>
                            <label htmlFor="email">Email</label>
                            <input name="email" onChange={(e) => {
                                handleChange(e);
                                isEmailValid(e.target.value)
                            }} value={email} type="email" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('phoneNumber') && 'error'} ${isWrong.includes('phoneNumber') && 'warning'}`}>
                            <label htmlFor="phoneNumber">Número de Contacto</label>
                            <input minLength="10" maxLength="10" name="phoneNumber" onChange={(e) => {
                                handleChange(e);
                                isNumberValid(e.target.value, 'phoneNumber')
                            }} value={phoneNumber} type="number" />
                        </div>
                        <div className="card__header mt-4">
                            <h4>Dirección</h4>
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('col') && 'error'}`}>
                            <label htmlFor="col">Colonia</label>
                            <input name="col" onChange={handleChange} value={col} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('street') && 'error'}`}>
                            <label htmlFor="street">Calle</label>
                            <input name="street" onChange={handleChange} value={street} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('intNumber') && 'error'}`}>
                            <label htmlFor="intNumber">Número interior</label>
                            <input name="intNumber" onChange={handleChange} value={intNumber} type="number" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('extNumber') && 'error'}`}>
                            <label htmlFor="extNumber">Número exterior</label>
                            <input name="extNumber" onChange={handleChange} value={extNumber} type="number" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('zip') && 'error'}`}>
                            <label htmlFor="zip">Código Postal</label>
                            <input name="zip" onChange={handleChange} value={zip} type="number" />
                        </div>

                    </form>
                    <div className="left">
                        <div className="card__header">
                            <img src="../assets/img/aval.png" alt="" />
                            <h4>Información del Aval</h4>
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avNames') && 'error'}`}>
                            <label htmlFor="avNames">Nombre(s)</label>
                            <input autoFocus name="avNames" onChange={handleChange} value={avNames} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avPatLastname') && 'error'}`}>
                            <label htmlFor="avPatLastname">Apellido Paterno</label>
                            <input name="avPatLastname" onChange={handleChange} value={avPatLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avMatLastname') && 'error'}`}>
                            <label htmlFor="avMatLastname">Apellido Materno</label>
                            <input name="avMatLastname" onChange={handleChange} value={avMatLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avPhoneNumber') && 'error'} ${isWrong.includes('avPhoneNumber') && 'warning'}`}>
                            <label htmlFor="avPhoneNumber">Número de contacto</label>
                            <input name="avPhoneNumber" onChange={(e) => {
                                handleChange(e);
                                isNumberValid(e.target.value, 'avPhoneNumber')
                            }} value={avPhoneNumber} type="number" autoComplete="off" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-buttons">
                <button className="cancel" onClick={cancel}>
                    Cancelar
                </button>
                <button className="next" onClick={handleCreateClient}>
                    Crear cliente
                </button>
            </div>

        </div>
    )
}
