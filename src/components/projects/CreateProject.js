import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalDisable, modalEnable, modalUpdate } from '../../actions/modal';
import { projectAddService, projectCreate, projectDeleteService } from '../../actions/project';
import { redirectSet } from '../../actions/redirect';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';

export const CreateProject = () => {

    const dispatch = useDispatch();

    const currentProject = useSelector(state => state.project);

    const [formValues, handleInputChange] = useForm(currentProject);

    const [serviceValue, handleServiceChange, setServiceValue] = useForm({ serviceName: '' });

    const { serviceName } = serviceValue;

    const { name, description, manzanas, lots, pricePerSqM, priceCorner } = formValues;

    const { docs, services } = currentProject;

    const { modal: { active, beenClosed, input, title, text, okMsg, closeMsg } } = useSelector(state => state);

    const [service, setService] = useState('');

    useEffect(() => {

        dispatch(redirectSet(redTypes.projects, '/proyectos/nuevo'));
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
        
    }, [dispatch]);

    const handleClose = () => {
        dispatch(modalDisable());
    }

    const saveChanges = () => {
        dispatch(projectCreate(formValues))
    }

    const handleDeleteService = (service) => {
        const modalInfo = {
            title: 'Eliminar servicio',
            text: `Desea eliminar el servicio: ${service}`,
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar',
            input: null
        }

        setService(service);

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    const handleDeleteSvc = (e) => {
        e?.preventDefault();
        dispatch(projectDeleteService(service))
        dispatch(modalDisable());

    }

    const handleAdd = () => {

        const modalInfo = {
            title: 'Agregar servicio',
            text: ``,
            input: true,
            okMsg: 'Agregar',
            closeMsg: 'Cancelar'
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());

    }

    const handleAddSvc = (e) => {
        e?.preventDefault();
        dispatch(projectAddService(serviceName));
        setServiceValue('serviceName', '');
        dispatch(modalDisable());
    }



    return (

        <div className="project-create">
            <h1>
                Crear Nuevo proyecto
            </h1>
            <form>
                <h2 className="section-title">Información General</h2>
                <div className="form-field">
                    <label htmlFor="name">Nombre del Proyecto:</label>
                    <input type="text" name="name" value={name} onChange={(e) => {handleInputChange(e); saveChanges();}} />
                </div>
                <div className="form-field desc">
                    <label htmlFor="description">Descripción del Proyecto:</label>
                    <textarea name="description" value={description} onChange={(e) => {handleInputChange(e); saveChanges();}} ></textarea>
                </div>
                <div className="form-field">
                    <label htmlFor="manzanas">Manzanas:</label>
                    <input type="number" name="manzanas" value={manzanas} onChange={(e) => {handleInputChange(e); saveChanges();}} />
                </div>
                <div className="form-field">
                    <label htmlFor="lots">Cantidad de Lotes:</label>
                    <input type="number" name="lots" value={lots} onChange={(e) => {handleInputChange(e); saveChanges();}} />
                </div>
                <div className="form-field">
                    <label htmlFor="pricePerSqM">Precio por metro cuadrado:</label>
                    <input type="number" name="pricePerSqM" value={pricePerSqM} onChange={(e) => {handleInputChange(e); saveChanges();}} />
                </div>
                <div className="form-field">
                    <label htmlFor="priceCorner">Precio por metro cuadrado de esquinas:</label>
                    <input type="number" name="priceCorner" value={priceCorner} onChange={(e) => {handleInputChange(e); saveChanges();}} />
                </div>
                <h2 className="section-title">Servicios</h2>
                <div className="form-field svcs">
                    <span onClick={() => { handleAdd('svc') }} className="add add-svc">
                        Agregar servicio
                    </span>
                    <div className="svcs__list">
                        <ul>
                            {
                                services.map(service => (
                                    <li onClick={() => handleDeleteService(service)} key={service} >{service}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <h2 className="section-title">Documentos del proyecto</h2>
                <div className="form-field docs">
                    <span className="add add-doc">
                        Agregar documento
                    </span>
                    <div className="docs__list">
                        {
                            docs.map(doc => (
                                <div
                                    key={doc.name}
                                    className="doc" >
                                    {doc.name}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </form>


            {
                <div className={` ${!active ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !active ? 'modal-bc modal-animate-hide' : ''}`} >
                    <div className="modal">
                        <h3 className="modal__title">
                            {title}
                        </h3>

                        <p className="modal__text">
                            {text}
                        </p>

                        <form
                            onSubmit={(e) => {
                                input ? handleAddSvc(e) : handleDeleteSvc(e);
                            }}
                            className="modal__form">

                            {
                                input && (
                                    <div className="modal__input">
                                        <div className="modal__input__field">
                                            <span>Nombre del Servicio:</span>
                                            <input autoFocus={true} type="text" name="serviceName" value={serviceName} onChange={handleServiceChange} />
                                        </div>
                                    </div>
                                )
                            }

                            <div className="modal__btns">
                                <p onClick={handleClose} className="modal__btns__link btn btn-err">
                                    {closeMsg}
                                </p>

                                <p
                                    onClick={() => {
                                        input ? handleAddSvc() : handleDeleteSvc();
                                    }}
                                    className="modal__btns__link btn btn-ok">
                                    {okMsg}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            }

        </div>
    )
}
