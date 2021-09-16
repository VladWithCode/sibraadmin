import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { floatingButtonSet } from '../../actions/floatingButton';
import { projectCreate, projectEnableSvcModal, projectUpdateSvcModal } from '../../actions/project';
import { redirectSet } from '../../actions/redirect';
import { setTempError, unSetError } from '../../actions/ui';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';
import { LotTypesList } from './LotTypesList';
import { ModalServices } from './ModalServices';
import { ModalLotType } from './ModalLotType';
import { ModalConfirmLotTypes } from './ModalConfirmLotTypes';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { uiStartLoading, uiFinishLoading } from '../../actions/ui';
import { staticURL } from '../../url';

export const EditProject = () => {

    const dispatch = useDispatch();

    const { projectId } = useParams();

    const { projectEdit: project, projects, types: { lotTypes }, services: availableServices } = useSelector(state => state);

    const currentProject = {
        name: project?.name,
        description: project?.description,
        associationName: project?.associationName,
        notary: project?.notary,
        propertyScripture: project?.propertyScripture,
        propertyBook: project?.propertyBook,
        scriptureDate: project?.scriptureDate,
        constitutiveScripture: project?.constitutiveScripture,
        constitutiveVolume: project?.constitutiveVolume
    }

    const [formFields, handleInputChange] = useForm(currentProject);

    const { name, description, associationName, notary, propertyScripture, propertyBook, scriptureDate, constitutiveScripture, constitutiveVolume } = formFields;


    const [service, setService] = useState('');
    const [emptyFields, setEmptyFields] = useState([]);
    const [hasChanged, setHasChanged] = useState([]);

    useEffect(() => {

        for (let key in formFields) {
            checkChanges(key, currentProject[key]);
        }

        const modalInfo = {
            title: 'Editar Proyecto',
            text: `¿Desea editar el proyecto ${project.name}?`,
            link: `/proyectos/editar/${projectId}`,
            okMsg: 'Sí',
            closeMsg: 'No',
        }

        dispatch(modalUpdate(modalInfo));

        dispatch(redirectSet(redTypes.projects, `/proyectos/editar/${projectId}`));
        dispatch(floatingButtonSet('pencil', redTypes.projectEdit));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, project.name, projectId, project.lotTypes]);

    const cancel = () => {

        const modalInfo = {
            title: 'Cancelar edición de proyecto',
            text: null,
            link: `/proyectos/ver/${projectId}`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.projectEdit
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    const isFormValid = () => {

        if (checkEmptyFields(formFields)) {
            dispatch(setTempError('Los campos en rojo son obligatorios'));
            return false;
        }


        if (description.trim().length < 10) {
            if (description.trim().length === 0) {
                dispatch(setTempError('El proyecto debe de tener una descripción'));
            } else {
                dispatch(setTempError('La descripción es muy corta'))
            }
            return false;
        }


        // if (!services || services?.length === 0) {
        //     dispatch(setTempError('Debe agregar al menos un servicio'));
        //     return false;
        // }

        if (!lotTypes || lotTypes?.length === 0) {
            dispatch(setTempError('Debe agregar al menos un tipo de lote'));
            return false;
        }


        dispatch(unSetError());
        return true;

    }

    const handleNextPage = async () => {

        if (isFormValid()) {

            let url = `${staticURL}/project/${projectId}`;

            const data = {
                doc: {
                    name,
                    associationName,
                    description,
                    availableServices,
                    notary,
                    propertyScripture,
                    propertyBook,
                    scriptureDate,
                    constitutiveScripture,
                    constitutiveVolume
                }
            }

            const typesData = lotTypes.map(lt => {
                const obj = {
                    code: lt.type,
                    _id: lt._id,
                    price: lt.pricePerM,
                    sameArea: lt.sameArea,
                    measures: null,
                    area: +lt.area
                }
                if (lt.front) {

                    obj.measures = [
                        {
                            title: 'frente',
                            value: lt.front
                        },
                        {
                            title: 'fondo',
                            value: lt.side
                        }
                    ]
                }

                return obj;
            })

            console.log('types', typesData);

            dispatch(uiStartLoading());

            const req = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return err;
                });


            if (req.status === "OK") {
                console.log('jeje');

                url = `${staticURL}/projects/${projectId}/lot-types`

                const req2 = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        typesData
                    })
                })
                    .then(response => {
                        return response.json()
                    })
                    .then(data => {
                        return data;
                    })
                    .catch(err => {
                        return err;
                    });

                console.log('a veeeer', req2);

                if (req2.status === "OK") {

                    const modalInfo = {
                        title: 'Proyecto actualizado',
                        text: `Se ha actualizado con éxito el proyecto ${name}`,
                        link: `/proyectos/doc/${projectId}`,
                        okMsg: 'Continuar',
                        closeMsg: null,
                        type: redTypes.projectCreate
                    }

                    dispatch(modalUpdate(modalInfo));
                    dispatch(modalEnable());

                } else {
                    dispatch(setTempError('Hubo un problema al actualizar los tipos de lotes'));
                }


            } else {
                dispatch(setTempError('Hubo un problema al actualizar el proyecto'));
            }

            dispatch(uiFinishLoading());



            // dispatch(projectSetPage(page + 1));
            // dispatch(projectCreate({
            //     ...formFields
            // }));
        }

    }

    const handleDeleteService = (service) => {

        const modalInfo = {
            title: 'Eliminar servicio',
            text: `Desea eliminar el servicio: ${service}`,
            input: '',
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar'
        }

        setService(service);

        dispatch(projectEnableSvcModal());
        dispatch(projectUpdateSvcModal(modalInfo));
    }

    const handleAdd = (e) => {

        const modalInfo = {
            title: 'Agregar servicio',
            text: ``,
            input: true,
            okMsg: 'Agregar',
            closeMsg: 'Cancelar'
        }


        dispatch(projectEnableSvcModal());
        dispatch(projectUpdateSvcModal(modalInfo));

    }


    const inputChange = e => {
        dispatch(projectCreate({ ...formFields, [e.target.name]: e.target.value }));
        handleInputChange(e);
        // checkEmptyFields({ ...formFields, [e.target.name]: e.target.value });
        checkEmptyField(e);
        checkChanges(e.target.name, e.target.value);
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


    const checkEmptyFields = (fields) => {

        const tempEmptyFields = [];

        for (let key in fields) {
            if (key === 'manzanas' || key === 'lots' || key === 'associationName' || key === 'name' || key === 'description') {
                if (fields[key].toString().trim() === "") {
                    tempEmptyFields.push(key);
                }
            }

        }

        setEmptyFields(tempEmptyFields);

        console.log(tempEmptyFields);

        return tempEmptyFields.length === 0 ? false : true;
    }


    const checkChanges = (attribute, value) => {

        const tempHasChanged = hasChanged;

        if (value === projects.find(p => p._id === projectId)[attribute]) {

            if (tempHasChanged.includes(attribute)) {
                const index = tempHasChanged.indexOf(attribute);

                tempHasChanged.splice(index, 1);
            }
        } else {
            if (!tempHasChanged.includes(attribute)) {
                tempHasChanged.push(attribute);
            }
        }

        console.log(tempHasChanged);

        setHasChanged(tempHasChanged);
    }


    return (

        <div className="pb-5 project create">
            <div className="project__header">
                <div className="left">
                    <h3> Editar Proyecto </h3>
                </div>
                {/* <div className="right">
                    Número de cliente {clients.length + 1}
                </div> */}
            </div>

            <div className="card edit mt-4">
                <div className="card__header">
                    <img src="../assets/img/info.png" alt="" />
                    <h4>Información General del Proyecto</h4>
                </div>
                <div className="card__body">
                    <div className="right">
                        <div className={`card__body__item ${emptyFields.includes('name') && 'error'} ${hasChanged.includes('name') && 'changed'}`}>
                            <label htmlFor="name">Nombre del Proyecto</label>
                            <input className={`card__body__item ${hasChanged.includes('name') && 'changed'}`} autoFocus name="name" onChange={(e) => { inputChange(e) }} value={name} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('associationName') && 'error'} ${hasChanged.includes('associationName') && 'changed'}`}>
                            <label htmlFor="associationName">Asociación</label>
                            <input className={`card__body__item ${hasChanged.includes('associationName') && 'changed'}`} autoFocus name="associationName" onChange={(e) => { inputChange(e) }} value={associationName} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item description ${emptyFields.includes('description') && 'error'}`}>
                            <span htmlFor="description">Descripción del Proyecto</span>
                            <textarea className={`card__body__item ${hasChanged.includes('description') && 'changed'}`} name="description" value={description} onChange={(e) => { inputChange(e) }} ></textarea>
                        </div>

                    </div>
                    <div className="left">

                        <div className={`card__body__item ${emptyFields.includes('notary') && 'error'} ${hasChanged.includes('notary') && 'changed'}`}>
                            <label htmlFor="notary">notario</label>
                            <input className={`card__body__item ${hasChanged.includes('notary') && 'changed'}`} autoFocus name="notary" onChange={(e) => { inputChange(e) }} value={notary} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('propertyScripture') && 'error'} ${hasChanged.includes('propertyScripture') && 'changed'}`}>
                            <label htmlFor="propertyScripture">número de escritura</label>
                            <input className={`card__body__item ${hasChanged.includes('propertyScripture') && 'changed'}`} autoFocus name="propertyScripture" onChange={(e) => { inputChange(e) }} value={propertyScripture} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('propertyBook') && 'error'} ${hasChanged.includes('propertyBook') && 'changed'}`}>
                            <label htmlFor="propertyBook">número de libro</label>
                            <input className={`card__body__item ${hasChanged.includes('propertyBook') && 'changed'}`} autoFocus name="propertyBook" onChange={(e) => { inputChange(e) }} value={propertyBook} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('scriptureDate') && 'error'} ${hasChanged.includes('scriptureDate') && 'changed'}`}>
                            <label htmlFor="scriptureDate">fecha de escrituración</label>
                            <input className={`card__body__item ${hasChanged.includes('scriptureDate') && 'changed'}`} autoFocus name="scriptureDate" onChange={(e) => { inputChange(e) }} value={scriptureDate} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('constitutiveScripture') && 'error'} ${hasChanged.includes('constitutiveScripture') && 'changed'}`}>
                            <label htmlFor="constitutiveScripture">escritura de acta constitutiva</label>
                            <input className={`card__body__item ${hasChanged.includes('constitutiveScripture') && 'changed'}`} autoFocus name="constitutiveScripture" onChange={(e) => { inputChange(e) }} value={constitutiveScripture} type="text" autoComplete="off" />
                        </div>
                        <div className={`card__body__item ${emptyFields.includes('constitutiveVolume') && 'error'} ${hasChanged.includes('constitutiveVolume') && 'changed'}`}>
                            <label htmlFor="constitutiveVolume">volumen de acta constitutiva</label>
                            <input className={`card__body__item ${hasChanged.includes('constitutiveVolume') && 'changed'}`} autoFocus name="constitutiveVolume" onChange={(e) => { inputChange(e) }} value={constitutiveVolume} type="text" autoComplete="off" />
                        </div>


                    </div>
                </div>
            </div>

            <div className="card-grid mt-2">
                <div className="card edit">

                    <div className="card__header">
                        <img src="../assets/img/services.png" alt="" />
                        <h4>Servicios Disponibles</h4>

                    </div>
                    <div className="add">
                        <button onClick={handleAdd} className="upload">
                            Agregar servicio
                        </button>
                    </div>

                    <div className="scroll">
                        <div className="card__body__list">
                            {
                                availableServices?.map(service => (
                                    service.length > 0 && (
                                        <div onClick={() => handleDeleteService(service)} key={service} className="card__body__list__doc">
                                            <p>{service}</p>
                                        </div>
                                    )
                                ))
                            }
                        </div>

                    </div>
                </div>

                <div className="card edit scroll">
                    <div className="card__header">
                        <img src="../assets/img/home.png" alt="" />
                        <h4>Tipos de lotes</h4>
                    </div>
                    <div className="card__body__list">
                        <LotTypesList project={project} />
                    </div>


                </div>
            </div>


            <div className="form-buttons">
                <button className="cancel" onClick={cancel}>
                    Cancelar
                </button>
                <button className="next" onClick={handleNextPage}>
                    Siguiente
                </button>
            </div>

            <ModalServices service={service} />

            <ModalLotType />

            <ModalConfirmLotTypes />

        </div>

    )
}
