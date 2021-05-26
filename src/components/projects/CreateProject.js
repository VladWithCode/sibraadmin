import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../../actions/project';
import { useForm } from '../../hooks/useForm';

export const CreateProject = () => {

    const [modal, setModal] = useState({
        active: false,
        name: '',
        input: false
    });

    const project = {
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
            {
                path: '',
                name: 'Contrato de servicio de Agua',
            },
            {
                path: '',
                name: 'Contrato de servicio de Luz',
            },
            {
                path: '',
                name: 'Escrituras',
            },
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

    const [formValues, handleInputChange, setValue] = useForm(project);


    const { name, description, manzanas, lots, services, docs, pricePerSqM, priceCorner, input, docName } = formValues;

    const handleDelete = () => {

        const newArray = modal.type === 'svc' ? services.filter(service => service !== modal.name) : docs.filter(doc => doc.name !== modal.name);

        setValue(modal.type === 'svc' ? 'services' : 'docs', newArray);

        setModal({ ...modal, active: false });
    }


    const dispatch = useDispatch();

    const handleAdd = (type) => {

        dispatch(createProject(name, description, manzanas, lots, services, docs, pricePerSqM, priceCorner));

        setModal({ ...modal, type, active: true, input: true })

    }

    const addService = (e) => {
        e.preventDefault();
        console.log(docName);
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
                                    <li onClick={() => setModal({ name: service, active: true, type: 'svc', input: false })} key={service} >{service}</li>
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
                                    onClick={() => setModal({ ...modal, active: true, type: 'doc', input: false })}
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
                (modal.active && !modal.input) && (
                    <div className={`${!modal.active ? 'modal-hidden' : 'modal-bc'}`}>
                        <div className="modal">
                            <h3 className="modal__title">
                                Desea eliminar {modal.name}
                            </h3>
                            <div className="modal__btns">
                                <p className="modal__btns__link btn-err" onClick={handleDelete}>
                                    Sí
                                </p>
                                <p onClick={() => setModal({ ...modal, active: false })} className="modal__btns__link btn-ok">
                                    No
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                (modal.active && modal.input) && (
                    <div className={`${!modal.active ? 'modal-hidden' : 'modal-bc'}`}>
                        <div className="modal">
                            <h3 className="modal__title">
                                Nombre de {modal.type === 'svc' ? 'Servicio' : 'Documento'}
                            </h3>
                            <form onSubmit={addService}>
                                <input
                                    type="text"
                                    name="docName"
                                    value={docName} 
                                    onChange={handleInputChange}
                                />
                                <div className="modal__btns">
                                    <button className="modal__btns__link btn-ok">
                                        Agregar
                                    </button>
                                    <p onClick={() => setModal({ ...modal, active: false })} className="modal__btns__link btn-err">
                                        Cancelar
                                    </p>
                                </div>
                            </form>

                        </div>
                    </div>
                )
            }


        </div>
    )
}
