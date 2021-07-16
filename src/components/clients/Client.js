import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { redTypes } from '../../types/reduxTypes';
import { redirectSet } from '../../actions/redirect';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { BreadCrumbs } from '../BreadCrumbs';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalUpdate } from '../../actions/modal';
import { getClient } from '../../actions/consults';
import { staticURLDocs } from '../../url';

export const Client = () => {

    const { clientId } = useParams();
    const dispatch = useDispatch();
    const { clients } = useSelector(state => state);
    const client = clients.find(c => c._id === clientId);

    const { names, patLastname, matLastname, phoneNumber, _id, address, curp, email, aval, files } = client;
    const { col, extNumber, street, zip } = address;

    useEffect(() => {

        dispatch(getClient(clientId));

        const modalInfo = {
            title: 'Editar Cliente',
            text: `¿Desea editar al cliente ${names} ${patLastname}?`,
            link: `/clientes/edit/${_id}`,
            okMsg: 'Sí',
            closeMsg: 'No',
        }

        dispatch(modalUpdate(modalInfo));

        const breadcrumbs = [
            {
                dispName: 'clientes',
                link: '/clientes'
            },
            {
                dispName: `${client.patLastname} ${client.names}`,
                link: `/clientes/ver/${clientId}`
            }
        ]

        dispatch(breadcrumbsUpdate(redTypes.clients, breadcrumbs));
        dispatch(redirectSet(redTypes.clients, `/clientes/ver/${clientId}`));
        dispatch(floatingButtonSet('pencil', redTypes.clientEdit));

    }, [dispatch, client, clientId, names, patLastname, _id]);

    const handleOpen = (path) => {
        const url = `${staticURLDocs}${path}`;

        window.open(url, "_blank", 'top=500,left=200,frame=true,nodeIntegration=no');
    }

    return (
        <>
            <BreadCrumbs type={redTypes.clients} ></BreadCrumbs>

            <div className="pb-5 project">
                <div className="project__header">
                    <div className="left">
                        <h3> Cliente </h3>
                        <span> {_id} </span>
                    </div>
                    <div className="right">

                    </div>
                </div>

                <div className="card">
                    <div className="card__header">
                        <img src="../assets/img/user.png" alt="" />
                        <h4>Información General del Cliente</h4>
                    </div>
                    <div className="card__body">
                        <div className="right">
                            <div className="card__body__item">
                                <span>Nombre(s)</span>
                                <p> {names} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Apellido Paterno</span>
                                <p> {patLastname} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Apellido Materno</span>
                                <p> {matLastname ? matLastname : ' '} </p>
                            </div>
                            <div className="card__body__item">
                                <span>RFC</span>
                                <p> {_id} </p>
                            </div>
                            <div className="card__body__item">
                                <span>CURP</span>
                                <p> {curp} </p>
                            </div>
                            <div className="mt-4 card__header">
                                <h4>Información de contacto</h4>
                            </div>
                            <div className="card__body__item">
                                <span>Email</span>
                                <p> {email} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Número de Contacto</span>
                                <p>{phoneNumber}</p>
                            </div>
                        </div>
                        <div className="left">

                            <div className=" card__header">
                                <h4>Dirección</h4>
                            </div>
                            <div className="card__body__item">
                                <span>Colonia</span>
                                <p>{col}</p>
                            </div>
                            <div className="card__body__item">
                                <span>Calle</span>
                                <p>{street}</p>
                            </div>
                            <div className="card__body__item">
                                <span>Número</span>
                                <p>{extNumber}</p>
                            </div>
                            <div className="card__body__item">
                                <span>Código Postal</span>
                                <p>{zip}</p>
                            </div>
                            <div className="mt-3 card__header">
                                <img src="../assets/img/docs.png" alt="" />
                                <h4>Documentos Disponibles</h4>
                            </div>
                            <div className="scroll">
                                <div className="card__body__list">
                                    {
                                        files?.map(({ name, staticPath }) => (
                                            <div onClick={() => { handleOpen(staticPath) }} key={name} className="card__body__list__doc">
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

                <div className="card-grid tall mb-4">
                    <div className="card">
                        <div className="card__header">
                            <img src="../assets/img/aval.png" alt="" />
                            <h4>Información del Aval</h4>
                        </div>

                        <div className="card__body">
                            <div className="full">
                                <div className="card__body__item">
                                    <span>Nombre(s)</span>
                                    <p>{aval.names}</p>
                                </div>
                                <div className="card__body__item">
                                    <span>Apellido Paterno</span>
                                    <p> {aval.patLastname} </p>
                                </div>
                                <div className="card__body__item">
                                    <span>Apellido Materno</span>
                                    <p> {aval.matLastname ? matLastname : ' '} </p>
                                </div>
                                <div className="card__body__item">
                                    <span>Número de Contacto</span>
                                    <p> {aval.phoneNumber} </p>
                                </div>
                                <div className="mt-3 card__header">
                                    <img src="../assets/img/docs.png" alt="" />
                                    <h4>Documentos Disponibles</h4>
                                </div>
                                <div className="scroll">
                                    <div className="card__body__list">
                                        {
                                            aval.files.map(({ name, staticPath }) => (
                                                <div onClick={() => { handleOpen(staticPath) }} key={name} className="card__body__list__doc">
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

                </div>


            </div>

        </>
    )
}
