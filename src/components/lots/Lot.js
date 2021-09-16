import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';
import { BreadCrumbs } from '../BreadCrumbs';
import { staticURLDocs } from '../../url';
import { getLot } from '../../actions/lot';
import { floatingButtonSet, secondaryFloatingButtonSet } from '../../actions/floatingButton';
import { FloatingButtonSecondary } from '../FloatingButtonSecondary';
import { Record } from '../history-globals/Record';
import { PriceHistory } from './PriceHistory';
import { ClientShort } from '../clients/ClientShort';
import { paymentOpen } from '../../actions/payments';
import { Cancellations } from '../history-globals/Cancellations';

export const Lot = () => {

    const { lotId, projectId } = useParams();

    const { lots, projects, lot: tempLot, clients } = useSelector(state => state);

    const [currentLot, setCurrentLot] = useState(tempLot._id ? tempLot : lots.find(lot => lot._id === lotId));

    const currentProject = projects.find(p => p._id === projectId);

    const { area, isCorner, lotNumber, measures, state, manzana, files, priceHistory, bindings, cancellations } = currentLot;

    const [currentClient, setCurrentClient] = useState(clients.find(c => c._id === currentLot.record));

    const { name, availableServices } = currentProject;

    const stateName = state === 'available' ? 'Disponible' : state === 'delivered' ? 'Entregado' : state === 'reserved' ? 'Comprado' : 'Liquidado';

    const dispatch = useDispatch();

    useEffect(() => {

        const modalInfo = {
            title: 'Editar lote',
            text: `¿Desea editar el lote ${lotNumber}?`,
            link: `/proyectos/edit/${projectId}/lote/${lotId}`,
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
                dispName: `${name}`,
                link: `/proyectos/ver/${projectId}`
            },
            {
                dispName: `Lote ${lotNumber}`,
                link: `/proyectos/ver/${projectId}/lote/${lotId}`
            }
        ]

        dispatch(breadcrumbsUpdate(redTypes.projects, breadcrumbs));
        dispatch(floatingButtonSet('pencil', redTypes.projectEdit));
        dispatch(redirectSet(redTypes.projects, `/proyectos/ver/${projectId}/lote/${lotId}`));
        dispatch(getLot(lotId));
        dispatch(secondaryFloatingButtonSet('bill', state === 'reserved' ? redTypes.lotReserved : null, projectId, lotId));
        dispatch(paymentOpen(projectId));

    }, [currentLot._id, dispatch, lotId, lotNumber, name, projectId, state]);

    useEffect(() => {
        setCurrentClient(clients.find(c => c._id === currentLot.customer));

        setCurrentLot(tempLot._id ? tempLot : lots.find(lot => lot._id === lotId));

    }, [clients, currentLot.customer, lotId, lots, tempLot]);

    const handleOpen = (path) => {
        const url = `${staticURLDocs}${path}`;

        window.open(url, "_blank", 'top=500,left=200,frame=true,nodeIntegration=no');
    }


    return (
        <>

            <BreadCrumbs type={redTypes.projects} />
            <FloatingButtonSecondary />

            <div className="project">

                <div className="project__header">
                    <div className="left">
                        <h3> Lote {lotNumber} </h3>
                        <span> {name} </span>
                    </div>
                    <div className="right">
                        <div className={`item state ${state}`}>
                            <p> {stateName} </p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card__header">
                        <img src="../assets/img/lots.png" alt="" />
                        <h4>Información General del Lote</h4>
                    </div>
                    <div className="card__body">
                        <div className="right">
                            <div className="card__body__item">
                                <span>Número de Lote</span>
                                <p> {lotNumber} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Número de Manzana</span>
                                <p> {manzana} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Proyecto</span>
                                <p> {name} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Esquina</span>
                                <p> {isCorner ? 'Sí' : 'No'} </p>
                            </div>
                            <div className="card__body__item">
                                <span>Área</span>
                                <p> {area}m<sup>2</sup> </p>
                            </div>
                            <div className="card__body__item">
                                <span >Precio</span>
                                <p className="price"> ${currentLot?.price?.toLocaleString()} </p>
                            </div>

                        </div>
                        <div className="left">
                            <div className="card__header">
                                <h4>Medidas</h4>
                            </div>
                            {
                                measures.length > 0 && (

                                    measures.map((measure) => (
                                        <div key={measure._id} className="card__body__item">
                                            <span>
                                                {measure.title}
                                            </span>
                                            <p>
                                                {measure.value}m<sup>2</sup>
                                            </p>
                                        </div>
                                    )
                                    )

                                )
                            }


                            {
                                bindings.length > 0 && (

                                    <>
                                        <div className="card__header mt-3">
                                            <h4>Colinancias</h4>
                                        </div>

                                        {bindings.map((binding, index) => (
                                            <div key={`binding-${index}`} className="card__body__item">
                                                <span>
                                                    Colinancia {index + 1}
                                                </span>
                                                <p>
                                                    {binding}
                                                </p>
                                            </div>
                                        )
                                        )}
                                    </>

                                )
                            }

                        </div>
                    </div>
                </div>



                <div className="card scroll mt-2">
                    <div className="full">
                        <div className="card__header">
                            <img src="../assets/img/services.png" alt="" />
                            <h4>Servicios Disponibles</h4>
                        </div>
                        <div className="card__body__list">
                            {
                                availableServices.map(service => (
                                    service.length > 0 && (
                                        <div key={service} className="card__body__list__item">
                                            <p>{service}</p>
                                        </div>
                                    )
                                ))
                            }
                        </div>
                        <div className="card__header mt-4">
                            <img src="../assets/img/docs.png" alt="" />
                            <h4>Documentos Disponibles</h4>
                        </div>
                        <div className="card__body__list">
                            {
                                files?.map(({ name, staticPath, _id }) => (
                                    <div onClick={() => { handleOpen(staticPath) }} key={_id} className="card__body__list__doc">
                                        <p>
                                            {name}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </div>

                {
                    currentClient && (
                        <>
                            <div className="project__header">
                                <div className="left">
                                    <h3> Cliente Comprador </h3>
                                </div>
                            </div>
                            <ClientShort client={currentClient} />
                        </>
                    )
                }

                {
                    (currentLot?.record && typeof currentLot?.record !== 'string') && (
                        <>
                            <div className="project__header">
                                <div className="left">
                                    <h3> Historiales </h3>
                                </div>
                            </div>

                            <Record key={currentLot?.record._id} record={currentLot?.record} lotId={lotId} />

                        </>
                    )
                }

                {
                    priceHistory && (
                        <>
                            <div className="project__header">
                                <div className="left">
                                    <h3> Historial de precios </h3>
                                </div>
                            </div>
                            <PriceHistory priceHistory={priceHistory} />
                        </>
                    )
                }

                {
                    cancellations && (

                        cancellations.length > 0 && (
                            <>
                                <div className="project__header">
                                    <div className="left">
                                        <h3> Cancelaciones </h3>
                                    </div>
                                </div>
                                <Cancellations cancellations={cancellations} />
                            </>
                        )

                    )
                }


            </div>

            {/* <FloatingButton type='lotAvailable' />
            <FloatingButtonSecondary type='lotAvailable' /> */}
        </>
    )
}