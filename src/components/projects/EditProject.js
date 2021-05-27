import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { modalDisable, modalEnable } from '../../actions/modal';
import { useForm } from '../../hooks/useForm';
import { useParams } from 'react-router-dom';

export const EditProject = () => {

    const { projectId } = useParams();
    const dispatch = useDispatch();

    const currentProject = {
        name: 'Colinas del Mar',
        description: 'Proyecto en Mazatlán ubicado a 15 minutos del malecón y a 10 del aeropuerto',
        manzanas: 12,
        lots: 440,
        services: [
            'Pavimento',
            'Servicio de luz',
            'Agua y drenaje',
            'Banqueta',
            'Vigilancia',
            'Alberca común'
        ],
        docs: [
            // {
            //     path: '',
            //     name: 'Contrato de servicio de Agua',
            // }
        ],
        pricePerSqM: 1200,
        priceCorner: 1500,
        types: [
            {
                type: 'a',
                sameArea: true,
                size: 96,
                isCorner: false,
            },
            {
                type: 'b',
                sameArea: true,
                size: 150,
                isCorner: false,
            },
            {
                type: 'c',
                sameArea: false,
                size: 0,
                isCorner: false,
            }
        ]
    }

    const [formValues, handleInputChange] = useForm(currentProject);

    const { name, description, manzanas, lots, services, docs, pricePerSqM, priceCorner } = formValues;

    const handleClose = () => {
        dispatch(modalDisable());
    }

    const handleServiceModal = (service) => {
        console.log(service);
        dispatch(modalEnable());
    }

    // const handleDelete = () => {


    // }

    const handleAdd = (type) => {


    }

    // const addService = (e) => {
    //     e.preventDefault();
    //     console.log(docName);
    // }

    const { modal:{active, beenClosed} } = useSelector(state => state);

    return (

        <div className="project-create">
            <h1>
                Editar proyecto {projectId}
            </h1>
            <form>
                <h2 className="section-title">Información General</h2>
                <div className="form-field">
                    <label htmlFor="name">Nombre del Proyecto:</label>
                    <input type="text" name="name" value={name} onChange={handleInputChange} />
                </div>
                <div className="form-field desc">
                    <label htmlFor="description">Descripción del Proyecto:</label>
                    <textarea name="description" value={description} onChange={handleInputChange} ></textarea>
                </div>
                <div className="form-field">
                    <label htmlFor="manzanas">Manzanas:</label>
                    <input type="number" name="manzanas" value={manzanas} onChange={handleInputChange} />
                </div>
                <div className="form-field">
                    <label htmlFor="lots">Cantidad de Lotes:</label>
                    <input type="number" name="lots" value={lots} onChange={handleInputChange} />
                </div>
                <div className="form-field">
                    <label htmlFor="pricePerSqM">Precio por metro cuadrado:</label>
                    <input type="number" name="pricePerSqM" value={pricePerSqM} onChange={handleInputChange} />
                </div>
                <div className="form-field">
                    <label htmlFor="priceCorner">Precio por metro cuadrado de esquinas:</label>
                    <input type="number" name="priceCorner" value={priceCorner} onChange={handleInputChange} />
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
                                    <li onClick={() => handleServiceModal(service)} key={service} >{service}</li>
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
                <div onClick={handleClose} className={` ${!active ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !active ? 'modal-bc modal-animate-hide' : ''}`} >
                    <div className="modal">
                        <h3 className="modal__title">
                            Agregar nuevo documento
                        </h3>

                        <div className="modal__btns">
                            <p onClick={handleClose} className="modal__btns__link btn btn-err">
                                Cancelar
                            </p>
                            <p className="modal__btns__link btn btn-ok">
                                Agregar
                            </p>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}
