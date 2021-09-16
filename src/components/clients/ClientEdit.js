import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { redTypes } from '../../types/reduxTypes';
import { useForm } from '../../hooks/useForm';
import { getClients } from '../../actions/consults';
import { floatingButtonSet } from '../../actions/floatingButton';
import { redirectSet } from '../../actions/redirect';
import { clientSet } from '../../actions/client';
import { setTempError, setTempWarning, uiStartLoading, uiFinishLoading } from '../../actions/ui';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { staticURL } from '../../url';
import { projectEnableSvcModal, projectUpdateSvcModal } from '../../actions/project';
import { ModalDoc } from '../ModalDoc';



export const ClientEdit = () => {

    const dispatch = useDispatch();
    const { clientId } = useParams();
    const { clients, client } = useSelector(state => state);

    const { refs, address } = client;

    const [refsArr, setrefsArr] = useState(refs);

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
        maritalState: client?.maritalState,
        occupation: client?.occupation,
        township: client?.township,
        state: client?.state,
        pob: client?.pob,
        dob: client?.dob,
        nationality: client?.nationality,
        col: address?.col,
        street: address?.street,
        zip: address?.zip?.toString(),
        extNumber: address?.extNumber?.toString(),
        intNumber: address?.intNumber?.toString()
    }

    const [formFields, handleInputChange] = useForm(initialForm);

    const { names, patLastname, matLastname, rfc, curp, email, maritalState, occupation, township, state, pob, dob, nationality, phoneNumber, col, street, zip, extNumber, intNumber } = formFields;

    const checkChanges = (attribute, value) => {

        const tempHasChanged = hasChanged;

        console.log(attribute);

        if (attribute === 'col' || attribute === 'street' || attribute === 'intNumber' || attribute === 'extNumber' || attribute === 'zip') {

            if (value) {
                if (value.toString() === clients.find(c => c._id === clientId).address[attribute].toString()) {

                    if (tempHasChanged.includes(attribute)) {
                        const index = tempHasChanged.indexOf(attribute);

                        tempHasChanged.splice(index, 1);
                    }
                } else {
                    if (!tempHasChanged.includes(attribute)) {
                        tempHasChanged.push(attribute);
                    }
                }
            }


            if (value === clients.find(c => c._id === clientId).address[attribute]) {

                if (tempHasChanged.includes(attribute)) {
                    const index = tempHasChanged.indexOf(attribute);

                    tempHasChanged.splice(index, 1);
                }
            } else {
                if (!tempHasChanged.includes(attribute)) {
                    tempHasChanged.push(attribute);
                }
            }

        } else {
            if (value === clients.find(c => c._id === clientId)[attribute]) {

                if (tempHasChanged.includes(attribute)) {
                    const index = tempHasChanged.indexOf(attribute);

                    tempHasChanged.splice(index, 1);
                }
            } else {
                if (!tempHasChanged.includes(attribute)) {
                    tempHasChanged.push(attribute);
                }
            }
        }


        setHasChanged(tempHasChanged);
    }

    useEffect(() => {

        // dispatch(getClient(clientId));
        // dispatch(getClients());
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        dispatch(redirectSet(redTypes.clients, `/clientes/edit/${clientId}`));

        for (let key in formFields) {
            checkChanges(key, formFields[key])
        }

        console.log(formFields);



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const handleChange = e => {
        handleInputChange(e);
        checkEmptyField(e);
        checkChanges(e.target.name, e.target.value);

        const tempClient = {}

        for (let key in formFields) {
            tempClient[key] = formFields[key]
        }

        dispatch(clientSet({
            ...client,
            ...tempClient,
            refs: refsArr
        }))
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
                    maritalState,
                    occupation,
                    township,
                    state,
                    pob,
                    dob,
                    nationality,
                    address: {
                        col,
                        street,
                        intNumber,
                        extNumber,
                        zip
                    },
                    refs: refsArr.map(ref => ({
                        names: ref.names,
                        patLastname: ref.patLastname,
                        matLastname: ref.matLastname,
                        phoneNumber: ref.phoneNumber,
                        email: ref.email,
                        address: {
                            col: ref.col,
                            street: ref.street,
                            extNumber: ref.extNumber,
                            intNumber: ref.intNumber,
                            zip: ref.zip
                        }
                    }))
                }

                const res = await updateClient(client);

                dispatch(uiFinishLoading());

                if (res.status === 'OK') {
                    const modalInfo = {
                        title: `Cliente ${names} actualizado con éxito`,
                        text: 'Continúa para agregar documentos',
                        link: `/clientes/docs/${res.customer._id}`,
                        okMsg: 'Continuar',
                        closeMsg: null,
                        type: redTypes.clientEdit
                    }

                    dispatch(modalUpdate(modalInfo));
                    dispatch(modalEnable());
                    dispatch(getClients())
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

        checkEmptyFields();
        isEmailValid(email);
        isNumberValid(phoneNumber, 'phoneNumber')

        const validNumbers = [];

        refsArr.forEach((ref, index) => {
            const isValid = isNumberValid(ref.phoneNumber, `phoneNumber${index}`);
            if (!isValid) {
                validNumbers.push(isValid);
            }
        })

        if (checkEmptyFields()) {
            return false;
        }

        if (!isNumberValid(phoneNumber, 'phoneNumber') || !isEmailValid(email) || checkEmptyFields(formFields)) {
            return false;
        }

        console.log('a veeer', validNumbers);


        if (validNumbers.length > 0) {
            return false
        }



        return true;
    }

    const checkEmptyFields = () => {

        const tempEmptyFields = []

        // maritalState, occupation, township, state, pob, dob, nationality,

        for (let key in formFields) {
            if (key !== 'intNumber' && key !== 'matLastname' && key !== 'avMatLastname' && key !== 'maritalState' && key !== 'occupation' && key !== 'township' && key !== 'state' && key !== 'pob' && key !== 'dob' && key !== 'nationality') {
                if (formFields[key].toString().trim() === "") {
                    tempEmptyFields.push(key);
                    dispatch(setTempError('Los campos en rojo son obligatorios'))
                }
            }
        }

        refsArr.forEach((ref, index) => {
            for (let key in ref) {
                if (key !== 'intNumber' && key !== 'matLastname' && key !== 'otherNumbers' && key !== 'col' && key !== 'street' && key !== 'extNumber' && key !== 'email' && key !== 'intNumber' && key !== 'zip' && key !== 'files') {
                    if (ref[key]) {
                        if (ref[key].toString().trim() === "") {
                            tempEmptyFields.push(`${key}${index}`);
                            dispatch(setTempError('Los campos en rojo son obligatorios'))
                        }
                    }
                }
            }
        })

        setEmptyFields(tempEmptyFields);

        console.log(tempEmptyFields);

        return tempEmptyFields.length === 0 ? false : true;
    }

    const checkEmptyField = e => {

        const tempEmptyFields = emptyFields;

        if (e.target.value?.trim().length > 0) {


            if (tempEmptyFields.includes(e.target.name)) {
                const index = tempEmptyFields.indexOf(e.target.name);

                tempEmptyFields.splice(index, 1);
            }


        }
        else {
            if (!tempEmptyFields.includes(e.target.name)) {
                tempEmptyFields.push(e.target.name)
            }
        }

        setEmptyFields(tempEmptyFields);

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

    const addRef = () => {
        const newRef = {
            names: '',
            patLastname: '',
            matLastname: '',
            email: '',
            phoneNumber: '',
            col: '',
            street: '',
            zip: '',
            extNumber: '',
            intNumber: ''
        }

        setrefsArr([...refsArr, newRef]);

        const tempClient = {}

        for (let key in formFields) {
            tempClient[key] = formFields[key]
        }


        dispatch(clientSet({
            ...client,
            ...tempClient,
            refs: [...refsArr, newRef]
        }))
    }

    const deleteRef = index => {
        refsArr.splice(index, 1);
        setrefsArr(refsArr);

        dispatch(clientSet({ ...formFields, refs: refsArr }));

        const tempClient = {}

        for (let key in formFields) {
            tempClient[key] = formFields[key]
        }

        dispatch(clientSet({
            ...client,
            ...tempClient,
            refs: refsArr
        }))
    }

    const handleChangeRef = (index, e, key) => {
        console.log(index, e.target.name, key);

        checkEmptyField(e);

        const tempRefsArr = refsArr;

        console.log(tempRefsArr);

        tempRefsArr[index][key] = e.target.value;

        setrefsArr(tempRefsArr);

        const tempClient = {}

        for (let key in formFields) {
            tempClient[key] = formFields[key]
        }

        dispatch(clientSet({
            ...client,
            ...tempClient,
            refs: tempRefsArr
        }))

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

            <div className="card-grid mt-4">
                <div className="card edit">
                    <div className="card__header">
                        <img src="../assets/img/user.png" alt="" />
                        <h4>Información General del Cliente</h4>
                    </div>
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
                    <div className={`card__body__item ${emptyFields.includes('maritalState') && 'error'}`}>
                        <label htmlFor="maritalState">Estado civil</label>
                        <input className={`${hasChanged.includes('maritalState') && 'changed'}`} name="maritalState" onChange={handleChange} value={matLastname} type="text" autoComplete="off" />
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('occupation') && 'error'}`}>
                        <label htmlFor="occupation">Ocupación</label>
                        <input className={`${hasChanged.includes('occupation') && 'changed'}`} name="occupation" onChange={handleChange} value={occupation} type="text" autoComplete="off" />
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('state') && 'error'}`}>
                        <label htmlFor="state">Estado</label>
                        <input className={`${hasChanged.includes('state') && 'changed'}`} name="state" onChange={handleChange} value={state} type="text" autoComplete="off" />
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('township') && 'error'}`}>
                        <label htmlFor="township">Municipio</label>
                        <input className={`${hasChanged.includes('township') && 'changed'}`} name="township" onChange={handleChange} value={township} type="text" autoComplete="off" />
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('pob') && 'error'}`}>
                        <label htmlFor="pob">Lugar de nacimiento</label>
                        <input className={`${hasChanged.includes('pob') && 'changed'}`} name="pob" onChange={handleChange} value={pob} type="text" autoComplete="off" />
                    </div>
                    <div className={`card__body__item ${emptyFields.includes('dob') && 'error'}`}>
                        <label htmlFor="dob">Fecha de nacimiento</label>
                        <input className={`${hasChanged.includes('dob') && 'changed'}`} name="dob" onChange={handleChange} value={dob} type="text" autoComplete="off" />
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

                </div>

                {
                    refsArr?.map((ref, index) => (
                        <div key={`ref${index}`} className="card edit">
                            {
                                index === 0 && (
                                    <div className="card__header">
                                        <img src="../assets/img/aval.png" alt="" />
                                        <h4>Referencias</h4>


                                        <button onClick={addRef} className="add-ref">Agregar referencia</button>


                                    </div>
                                )
                            }

                            <div >
                                <div className=" mt-4 card__header">
                                    <h4>Información de Referencia {index + 1}</h4>
                                    {
                                        index !== 0 && (
                                            <button onClick={() => deleteRef(index)} className="add-ref delete">Eliminar referencia</button>
                                        )
                                    }
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`names${index}`) && 'error'}`}>
                                    <label htmlFor={`names${index}`}>Nombre(s)</label>
                                    <input autoFocus name={`names${index}`} onChange={e => handleChangeRef(index, e, 'names')} value={ref.names} type="text" autoComplete="off" />
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`patLastname${index}`) && 'error'}`}>
                                    <label htmlFor={`patLastname${index}`}>Apellido Paterno</label>
                                    <input name={`patLastname${index}`} onChange={e => handleChangeRef(index, e, 'patLastname')} value={ref.patLastname} type="text" autoComplete="off" />
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`matLastname${index}`) && 'error'}`}>
                                    <label htmlFor={`matLastname${index}`}>Apellido Materno</label>
                                    <input name={`matLastname${index}`} onChange={e => handleChangeRef(index, e, 'matLastname')} value={ref.matLastname} type="text" autoComplete="off" />
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`phoneNumber${index}`) && 'error'} ${isWrong.includes(`phoneNumber${index}`) && 'warning'}`}>
                                    <label htmlFor={`phoneNumber${index}`}>Número de contacto</label>
                                    <input name={`phoneNumber${index}`} onChange={(e) => {
                                        handleChangeRef(index, e, 'phoneNumber');
                                        isNumberValid(e.target.value, `phoneNumber${index}`)
                                    }} value={ref.phoneNumber} type="number" autoComplete="off" />
                                </div>
                                <div className={`card__body__item  ${isWrong.includes(`email${index}`) && 'warning'}`}>
                                    <label htmlFor={`email${index}`}>Email</label>
                                    <input name={`email${index}`} onChange={(e) => {
                                        handleChangeRef(index, e, 'email');
                                        // isEmailValid(e.target.value)
                                    }} value={ref.email} type="email" />
                                </div>
                                <div className="card__header mt-4">
                                    <h4>Dirección</h4>
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`col${index}`) && 'error'}`}>
                                    <label htmlFor={`col${index}`}>Colonia</label>
                                    <input name={`col${index}`} onChange={e => handleChangeRef(index, e, 'col')} value={ref.col} type="text" autoComplete="off" />
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`street${index}`) && 'error'}`}>
                                    <label htmlFor={`street${index}`}>Calle</label>
                                    <input name={`street${index}`} onChange={e => handleChangeRef(index, e, 'street')} value={ref.street} type="text" autoComplete="off" />
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`intNumber${index}`) && 'error'}`}>
                                    <label htmlFor={`intNumber${index}`}>Número interior</label>
                                    <input name={`intNumber${index}`} onChange={e => handleChangeRef(index, e, 'intNumber')} value={ref.intNumber} type="number" />
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`extNumber${index}`) && 'error'}`}>
                                    <label htmlFor={`extNumber${index}`}>Número exterior</label>
                                    <input name={`extNumber${index}`} onChange={e => handleChangeRef(index, e, 'extNumber')} value={ref.extNumber} type="number" />
                                </div>
                                <div className={`card__body__item ${emptyFields.includes(`zip${index}`) && 'error'}`}>
                                    <label htmlFor={`zip${index}`}>Código Postal</label>
                                    <input name={`zip${index}`} onChange={e => handleChangeRef(index, e, 'zip')} value={ref.zip} type="number" />
                                </div>

                            </div>
                        </div>
                    ))
                }



            </div>

            <div className="form-buttons">
                <button className="cancel" onClick={cancel}>
                    Cancelar
                </button>
                <button className="next" onClick={handleCreateClient}>
                    Guardar Cambios
                </button>
            </div>

        </div>
    )
}
