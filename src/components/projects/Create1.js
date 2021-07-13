import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { floatingButtonSet } from '../../actions/floatingButton';
// import { projectCreate, projectEnableSvcModal, projectSetPage, projectUpdateSvcModal } from '../../actions/project';
import { projectCreate, projectEnableSvcModal, projectSetPage, projectUpdateSvcModal } from '../../actions/project';
import { redirectSet } from '../../actions/redirect';
import { setTempError, unSetError } from '../../actions/ui';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';
import { LotTypesList } from './LotTypesList';
import { ModalServices } from './ModalServices';
import { ModalLotType } from './ModalLotType';
import { ModalConfirmLotTypes } from './ModalConfirmLotTypes';
import { modalEnable, modalUpdate } from '../../actions/modal';


export const Create1 = () => {

    const dispatch = useDispatch();

    const { project: currentProject, types: { lotTypes }, services } = useSelector(state => state);

    const [formValues, handleInputChange] = useForm(currentProject);

    const { name, description, manzanas, lots } = formValues;

    const { page } = currentProject;

    const [service, setService] = useState('');

    useEffect(() => {

        dispatch(redirectSet(redTypes.projects, '/proyectos/nuevo'));
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));

    }, [dispatch]);

    const cancel = () => {

        const modalInfo = {
            title: 'Cancelar creación de proyecto',
            text: null,
            link: '/proyectos',
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.projectCreate
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    const isFormValid = () => {

        // name, description, manzanas, lots, pricePerSqM, priceCorner

        if (name.trim().length <= 3) {
            if (name.trim().length === 0) {
                dispatch(setTempError('El proyecto debe de tener un nombre'));
            } else {
                dispatch(setTempError('El Nombre debe ser más largo'));
            }
            return false;
        }
        if (description.trim().length < 20) {
            if (description.trim().length === 0) {
                dispatch(setTempError('El proyecto debe de tener una descripción'));
            } else {
                dispatch(setTempError('La descripción es muy corta'))
            }
            return false;
        }
        if (Number(manzanas) === 0) {
            dispatch(setTempError('El proyecto debe tener al menos una manzana'));
            return false;
        }

        if ((Number(manzanas) % 1) !== 0) {
            dispatch(setTempError('El número de manzanas debe ser un entero'));
            console.log(Number(manzanas));
            return false;
        }

        if (Number(lots) === 0) {
            dispatch(setTempError('El proyecto no tienen lotes'));
            return false;
        }

        if ((Number(lots) % 1) !== 0) {
            dispatch(setTempError('El número de lotes debe ser un entero'));
            return false;
        }

        if (Number(manzanas) > Number(lots)) {
            dispatch(setTempError('No pueden haber más manzanas que lotes'));
            return false;
        }

        if (Number(manzanas) === Number(lots)) {
            dispatch(setTempError('No puede haber un lote por manzana'));
            return false;
        }

        if (!Number(manzanas) || !Number(lots)) {
            dispatch(setTempError('Valor(es) de lotes o manzanas no válido(s)'));
            return false;
        }

        if (!services || services?.length === 0) {
            dispatch(setTempError('Debe agregar al menos un servicio'));
            return false;
        }

        if (!lotTypes || lotTypes?.length === 0) {
            dispatch(setTempError('Debe agregar al menos un tipo de lote'));
            return false;
        }

        dispatch(unSetError());
        return true;

    }

    const handleNextPage = () => {

        if (isFormValid()) {
            dispatch(projectSetPage(page + 1));
            dispatch(projectCreate(formValues));
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



    const handleAdd = () => {

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
        dispatch(projectCreate(formValues));
        handleInputChange(e);
    }




    return (

        <>
            <h1>
                Crear Nuevo proyecto
            </h1>
            <form>
                <h2 className="section-title">Información General</h2>
                <div className="form-field">
                    <label htmlFor="name">Nombre del Proyecto:</label>
                    <input type="text" name="name" value={name} onChange={(e) => { inputChange(e) }} />
                </div>
                <div className="form-field desc">
                    <label htmlFor="description">Descripción del Proyecto:</label>
                    <textarea name="description" value={description} onChange={(e) => { inputChange(e) }} ></textarea>
                </div>
                <div className="form-field">
                    <label htmlFor="manzanas">Manzanas:</label>
                    <input type="number" name="manzanas" value={manzanas} onChange={(e) => { inputChange(e) }} />
                </div>
                <div className="form-field">
                    <label htmlFor="lots">Cantidad de Lotes:</label>
                    <input type="number" name="lots" value={lots} onChange={(e) => { inputChange(e) }} />
                </div>
                <h2 className="section-title">Servicios</h2>
                <div className="form-field svcs">
                    <span onClick={handleAdd} className="add add-svc">
                        Agregar servicio
                    </span>
                    <div className="svcs__list">
                        <ul>
                            {
                                services?.map(service => (
                                    <li onClick={() => handleDeleteService(service)} key={service} >{service}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <h2 className="section-title">Tipos de Lotes</h2>
                <div className="form-field">
                    <LotTypesList />
                </div>

            </form>


            <ModalServices service={service} />

            <ModalLotType />

            <ModalConfirmLotTypes />


            <div className="project-create-btns">
                <button onClick={cancel} className="btn btn-cancel">
                    Cancelar
                </button>
                <button onClick={handleNextPage} className="btn btn-next">
                    Siguiente
                </button>
            </div>

        </>
    )
}
