import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { redTypes } from '../../types/reduxTypes';
import { useForm } from '../../hooks/useForm';
import { getClient, getClients } from '../../actions/consults';
import { floatingButtonSet } from '../../actions/floatingButton';
import { redirectSet } from '../../actions/redirect';
import { setTempError, setTempWarning, uiStartLoading, uiFinishLoading, setTempSuccessNotice } from '../../actions/ui';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { staticURL } from '../../url';
import { projectEnableSvcModal, projectUpdateSvcModal } from '../../actions/project';
import { ModalDoc } from '../ModalDoc';



export const ClientEdit = () => {

    const dispatch = useDispatch();
    const { clientId } = useParams();
    const { clients, client } = useSelector(state => state);

    const { aval, files, address } = client;

    const [emptyFields, setEmptyFields] = useState([]);

    const [isWrong, setIsWrong] = useState([]);

    const [hasChanged, setHasChanged] = useState([]);

    const [fileInfo, setFileInfo] = useState({
        fileName: '',
        type: ''
    });


    const initialForm = {
        names: client?.names,
        patLastname: client?.patLastname,
        matLastname: client?.matLastname,
        rfc: client?.rfc,
        curp: client?.curp,
        email: client?.email,
        phoneNumber: client?.phoneNumber?.toString(),
        col: address?.col,
        street: address?.street,
        zip: address?.zip?.toString(),
        extNumber: address?.extNumber?.toString(),
        intNumber: address?.intNumber?.toString(),
        avNames: aval?.names,
        avPatLastname: aval?.patLastname,
        avMatLastname: aval?.matLastname,
        avPhoneNumber: aval?.phoneNumber?.toString()
    }

    const [formFields, handleInputChange] = useForm(initialForm);

    const { names, patLastname, matLastname, rfc, curp, email, phoneNumber, col, street, zip, extNumber, intNumber, avNames, avMatLastname, avPatLastname, avPhoneNumber } = formFields;

    const [filesDoc, setFilesDoc] = useState({
        file: null,
        avFile: null
    })

    const [filesNames, handleFileNameChange, reset] = useForm({
        fileName: '',
        avFileName: ''
    })

    const { fileName, avFileName } = filesNames;

    const types = {
        client: 'client',
        aval: 'aval'
    }

    useEffect(() => {

        dispatch(getClient(clientId));
        dispatch(getClients());
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.clients, `/clientes/edit/${clientId}`));

    }, [dispatch, clientId]);

    const handleChange = e => {
        handleInputChange(e);
        checkEmptyField(e);
        checkChanges(e.target.name, e.target.value);
    }

    const cancel = () => {

        const modalInfo = {
            title: 'Cancelar edición de cliente',
            text: '¿Desea cancelar la edición del cliente?',
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

        if (hasChanged.length > 0) {
            if (isFormValid() && isWrong.length === 0) {

                dispatch(uiStartLoading());

                const client = {
                    names,
                    patLastname,
                    matLastname,
                    rfc,
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

                const res = await updateClient(client);

                dispatch(uiFinishLoading());

                if (res.status === 'OK') {
                    const modalInfo = {
                        title: `Cliente ${names} actualizado con éxito`,
                        text: '¿Desea volver a la pantalla de clientes?',
                        link: `/clientes`,
                        okMsg: 'Sí',
                        closeMsg: 'No',
                        type: redTypes.clientEdit
                    }

                    dispatch(modalUpdate(modalInfo));
                    dispatch(modalEnable());
                    // dispatch(clientSet(res.customer));

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
        } else {
            const modalInfo = {
                title: `Cliente ${names} actualizado con éxito`,
                text: '¿Desea volver a la pantalla de clientes?',
                link: `/clientes`,
                okMsg: 'Sí',
                closeMsg: 'No',
                type: redTypes.clientEdit
            }

            dispatch(modalUpdate(modalInfo));
            dispatch(modalEnable());
        }

    }

    const isDuplicated = (customer) => {
        const { phoneNumber, rfc, curp, email } = customer;

        let key, dispName, isRepeated = false;

        // console.log(customer);

        clients.forEach(client => {
            if (client.phoneNumber === +phoneNumber) {
                key = 'phoneNumber';
                dispName = 'Número de contacto';
                isRepeated = true;
            }
            if (client.rfc === rfc) {
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

        checkEmptyFields(formFields);
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
                if (formFields[key].toString().trim() === "") {
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
        const isValid = number.toString().length === 10 ? true : false;

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

    const updateClient = (client) => {

        const data = {
            doc: client
        }

        const url = `${staticURL}/customers/${clientId}`;

        // dispatch(uiStartLoading());

        const res = fetch(url, {
            method: 'PUT',
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

    const checkChanges = (attribute, value) => {

        const tempHasChanged = hasChanged;
        if (value === initialForm[attribute]) {


            if (tempHasChanged.includes(attribute)) {
                const index = tempHasChanged.indexOf(attribute);

                tempHasChanged.splice(index, 1);
            }
        } else {
            if (!tempHasChanged.includes(attribute)) {
                tempHasChanged.push(attribute);
            }
        }
        setHasChanged(tempHasChanged);
    }

    const onFileInput = (e, type) => {
        setFilesDoc(
            { ...filesDoc, [type]: e.target.files[0] }
        )
    }

    const uploadFile = async (file, name, type, e) => {
        e?.preventDefault();

        dispatch(uiStartLoading());

        const newForm = new FormData();

        newForm.set('file', file);
        newForm.set('fileName', name);

        console.log(newForm);

        const url = `${staticURL}/customer/${clientId}/${type === types.client ? 'file' : 'aval/file'}`;


        await fetch(url, { // Your POST endpoint
            method: 'PUT',
            body: newForm

        }).then(
            response => {
                console.log(response);
                return response.json();
            } // if the response is a JSON object
        ).then(
            success => {
                console.log(success);
                dispatch(uiFinishLoading());
                dispatch(setTempSuccessNotice(`Archivo ${name} agregado con éxito`));
                dispatch(getClient(clientId));
            } // Handle the success response object
        ).catch(
            error => console.log(error) // Handle the error response object
        );

        reset();

        const inputFile = document.querySelector(`[name=${type === types.client ? 'file' : 'avFile'}]`);
        inputFile.value = null;
    }

    const handleDeleteFile = (fileName, type) => {

        const modalInfo = {
            title: 'Eliminar documento',
            text: `¿Desea eliminar el documento: ${fileName}?`,
            input: null,
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar'
        }

        setFileInfo({ fileName, type });

        dispatch(projectEnableSvcModal());
        dispatch(projectUpdateSvcModal(modalInfo));
    }

    const deleteClient = (type) => {
        const modalInfo = {
            title: 'Eliminar Cliente',
            text: `¿Desea eliminar al cliente ${names} ${patLastname}?`,
            input: null,
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar'
        }

        setFileInfo({ fileName: `${names} ${patLastname}`, type });

        dispatch(projectEnableSvcModal());
        dispatch(projectUpdateSvcModal(modalInfo));
    }

    return (
        <div className="pb-5 project create">
            <div className="project__header">
                <div className="left">
                    <h3> Edición de Cliente </h3>
                </div>
                <div className="right">
                    <button className="cancel" onClick={() => deleteClient(redTypes.clientDelete)}>
                        Eliminar cliente
                    </button>
                </div>
            </div>

            <ModalDoc fileName={fileInfo.fileName} type={fileInfo.type} id={client._id} />

            <div className="card edit mt-4">
                <div className="card__header">
                    <img src="../assets/img/user.png" alt="" />
                    <h4>Información General del Cliente</h4>
                </div>
                <div className="card__body">
                    <form className="right">
                        <div className={`card__body__item ${emptyFields.includes('names') && 'error'}`}>
                            <label htmlFor="names">Nombre(s)</label>
                            <input className={`${hasChanged.includes('names') && 'changed'}`} autoFocus name="names" onChange={handleChange} value={names} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('patLastname') && 'error'}`}>
                            <label htmlFor="patLastname">Apellido Paterno</label>
                            <input className={`${hasChanged.includes('patLastname') && 'changed'}`} name="patLastname" onChange={handleChange} value={patLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('matLastname') && 'error'}`}>
                            <label htmlFor="matLastname">Apellido Materno</label>
                            <input className={`${hasChanged.includes('matLastname') && 'changed'}`} name="matLastname" onChange={handleChange} value={matLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('rfc') && 'error'}`}>
                            <label htmlFor="rfc">RFC</label>
                            <input className={`${hasChanged.includes('rfc') && 'changed'}`} minLength="12" maxLength="13" name="rfc" onChange={handleChange} value={rfc} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('curp') && 'error'}`}>
                            <label htmlFor="curp">CURP</label>
                            <input className={`${hasChanged.includes('curp') && 'changed'}`} minLength="18" maxLength="18" name="curp" onChange={handleChange} value={curp} type="text" autoComplete="off" />
                        </div>
                        <div className="mt-4 card__header">
                            <h4>Información de contacto</h4>
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('email') && 'error'} ${isWrong.includes('email') && 'warning'}`}>
                            <label htmlFor="email">Email</label>
                            <input className={`${hasChanged.includes('email') && 'changed'}`} name="email" onChange={(e) => {
                                handleChange(e);
                                isEmailValid(e.target.value)
                            }} value={email} type="email" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('phoneNumber') && 'error'} ${isWrong.includes('phoneNumber') && 'warning'}`}>
                            <label htmlFor="phoneNumber">Número de Contacto</label>
                            <input className={`${hasChanged.includes('phoneNumber') && 'changed'}`} minLength="10" maxLength="10" name="phoneNumber" onChange={(e) => {
                                handleChange(e);
                                isNumberValid(e.target.value, 'phoneNumber')
                            }} value={phoneNumber} type="number" />
                        </div>
                        <div className="card__header mt-4">
                            <h4>Dirección</h4>
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('col') && 'error'}`}>
                            <label htmlFor="col">Colonia</label>
                            <input className={`${hasChanged.includes('col') && 'changed'}`} name="col" onChange={handleChange} value={col} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('street') && 'error'}`}>
                            <label htmlFor="street">Calle</label>
                            <input className={`${hasChanged.includes('street') && 'changed'}`} name="street" onChange={handleChange} value={street} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('intNumber') && 'error'}`}>
                            <label htmlFor="intNumber">Número interior</label>
                            <input className={`${hasChanged.includes('intNumber') && 'changed'}`} name="intNumber" onChange={handleChange} value={intNumber} type="number" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('extNumber') && 'error'}`}>
                            <label htmlFor="extNumber">Número exterior</label>
                            <input className={`${hasChanged.includes('extNumber') && 'changed'}`} name="extNumber" onChange={handleChange} value={extNumber} type="number" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('zip') && 'error'}`}>
                            <label htmlFor="zip">Código Postal</label>
                            <input className={`${hasChanged.includes('zip') && 'changed'}`} name="zip" onChange={handleChange} value={zip} type="number" />
                        </div>

                        <div className="mt-3 card__header">
                            <img src="../assets/img/docs.png" alt="" />
                            <h4>Documentos Disponibles</h4>
                        </div>
                        <input onInput={(e) => {
                            onFileInput(e, 'file');
                        }} type="file" name="file" />
                        <div className="file-form mt-2">
                            <div className={`card__body__item`}>
                                <label htmlFor="fileName">Nombre del Archivo</label>
                                <input type="text" name="fileName" onChange={handleFileNameChange} value={fileName} />
                            </div>
                            <button disabled={fileName.length >= 3 && (filesDoc.file) ? false : true} className="upload" onClick={(e) => {
                                uploadFile(filesDoc.file, fileName, types.client, e)
                            }}  > Subir archivo</button>
                        </div>

                        <div className="scroll mt-3">
                            <div className="card__body__list">
                                {
                                    files.map(({ name }) => (
                                        <div onClick={() => { handleDeleteFile(name, redTypes.client) }} key={name} className="card__body__list__doc">
                                            <p>
                                                {name}
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </form>
                    <div className="left">
                        <div className="card__header">
                            <img src="../assets/img/aval.png" alt="" />
                            <h4>Información del Aval</h4>
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avNames') && 'error'}`}>
                            <label htmlFor="avNames">Nombre(s)</label>
                            <input className={`${hasChanged.includes('avNames') && 'changed'}`} autoFocus name="avNames" onChange={handleChange} value={avNames} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avPatLastname') && 'error'}`}>
                            <label htmlFor="avPatLastname">Apellido Paterno</label>
                            <input className={`${hasChanged.includes('avPatLastname') && 'changed'}`} name="avPatLastname" onChange={handleChange} value={avPatLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avMatLastname') && 'error'}`}>
                            <label htmlFor="avMatLastname">Apellido Materno</label>
                            <input className={`${hasChanged.includes('avMatLastname') && 'changed'}`} name="avMatLastname" onChange={handleChange} value={avMatLastname} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('avPhoneNumber') && 'error'} ${isWrong.includes('avPhoneNumber') && 'warning'}`}>
                            <label htmlFor="avPhoneNumber">Número de contacto</label>
                            <input className={`${hasChanged.includes('avPhoneNumber') && 'changed'}`} name="avPhoneNumber" onChange={(e) => {
                                handleChange(e);
                                isNumberValid(e.target.value, 'avPhoneNumber')
                            }} value={avPhoneNumber} type="number" autoComplete="off" />
                        </div>

                        <div className="mt-3 card__header">
                            <img src="../assets/img/docs.png" alt="" />
                            <h4>Documentos Disponibles</h4>
                        </div>
                        <input onInput={(e) => {
                            onFileInput(e, 'avFile');
                        }} type="file" name="avFile" />
                        <div className="file-form mt-2">
                            <div className={`card__body__item`}>
                                <label htmlFor="avFileName">Nombre del Archivo</label>
                                <input type="text" name="avFileName" onChange={handleFileNameChange} value={avFileName} />
                            </div>
                            <button disabled={avFileName.length >= 3 && (filesDoc.avFile) ? false : true} className="upload" onClick={(e) => {
                                uploadFile(filesDoc.avFile, avFileName, types.aval)
                            }}  > Subir archivo</button>
                        </div>

                        <div className="scroll mt-3">
                            <div className="card__body__list">
                                {
                                    aval.files.map(({ name, staticPath }) => (
                                        <div onClick={() => { handleDeleteFile(name, redTypes.aval) }} key={name} className="card__body__list__doc">
                                            <p>
                                                {name}
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-buttons">
                <button className="cancel" onClick={cancel}>
                    Cancelar
                </button>
                <button className="next" onClick={handleCreateClient}>
                    Terminar edición
                </button>
            </div>

        </div>
    )
}
