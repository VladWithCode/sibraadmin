import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';
import { BreadCrumbs } from '../BreadCrumbs';
import { FloatingButton } from '../FloatingButton';
import { FloatingButtonSecondary } from '../FloatingButtonSecondary';

export const Lot = () => {

    const { lotId, projectId } = useParams();

    // Temp
    const status = 'sold';

    const dispatch = useDispatch();

    useEffect(() => {

        const modalInfo = {
            title: 'Editarproyecto',
            text: '¿Desea editar el proyecto {name}?',
            link: `/proyectos/editar/${projectId}`,
            okMsg: 'Sí',
            closeMsg: 'No',
        }

        dispatch(modalUpdate(modalInfo));

        const breadcrumbs = [
            {
                dispName: 'proyectos',
                link: '/proyectos'
            },
            {
                dispName: `Proyecto ${projectId}`,
                link: `/proyectos/ver/${projectId}`
            },
            {
                dispName: `Proyecto ${projectId} || Lote ${lotId}`,
                link: `proyectos/ver/ ${projectId}/lote/${lotId}`
            }
        ]

        dispatch(breadcrumbsUpdate(redTypes.projects, breadcrumbs));
        dispatch(redirectSet(redTypes.projects, `proyectos/ver/ ${projectId}/lote/${lotId}`));

    }, [dispatch, projectId, lotId]);


    return (
        <>
            <BreadCrumbs type={redTypes.projects} />

            <div className="project lot">
                <div className="project__header">
                    <img src="/../assets/img/1.jpg" alt="" />
                    <div className="project__header__info">
                        <h1>Colinas del Mar</h1>
                    </div>
                </div>
                <div className="lot__body project__body">
                    <div className="lot__body__info">
                        <h2>Información del Lote</h2>
                        <div className="item">
                            <p>Número de lote: <span>{lotId}</span></p>
                            <p>Manzana: <span>5</span></p>
                        </div>
                        <div className="lot__body__svcs project__body__svcs item">
                            Servicios disponibles:
                            <ul>
                                <li>Pavimento</li>
                                <li>Servicio de luz</li>
                                <li>Drenjae y agua</li>
                                <li>Banqueta</li>
                                <li>Cordonería</li>
                                <li>Vigilancia</li>
                                <li>Pista</li>
                            </ul>
                        </div>
                        {
                            (status === 'pending' || status === 'sold') && (
                                <>
                                    <h2>Información del Cliente</h2>
                                    <div className="item">
                                        <p>Número: <span>{'Jairo Bladimir Rangel Cabrera'}</span></p>
                                        <p>Número de contácto: <span>{6181234567}</span></p>
                                    </div>
                                    <h2 className="docs">Documentos</h2>
                                    <div className="project__body__docs lot__body__docs">
                                        <div className="doc">Escrituras</div>
                                        <div className="doc">Contrato de servicio de agua y drenaje</div>
                                        <div className="doc">Contrato de servicio de electricidad</div>
                                        <div className="doc">Planos</div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                    <div className="lot__body__resume">
                        <p className={`status ${status === 'sold' ? 'sold' : status === 'pending' ? 'pending' : 'available'}`}>{status === 'sold' ? 'Liquidado' : status === 'pending' ? 'Vendido' : 'Disponible'}</p>
                        <div className="item">
                            <p>Área: <span>96m<sup>2</sup></span></p>
                            <p className="price">Precio: <span>$140,000.00</span></p>
                            {
                                status === 'pending' && (
                                    <>
                                        <p className="paid">Pagado: <span>$95,000.00</span></p>
                                        <p className="remaining">Restante: <span>$45,000.00</span></p>
                                    </>
                                )
                            }
                        </div>
                    </div>

                </div>
            </div>

            <FloatingButton type='lotAvailable' />
            <FloatingButtonSecondary type='lotAvailable' />
        </>
    )
}