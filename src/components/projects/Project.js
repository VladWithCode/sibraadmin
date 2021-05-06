import React from 'react';
import { useParams } from 'react-router-dom';
import { usePushBreadcrumbs } from '../../hooks/usePushBreadcrumbs';
import { types } from '../../types';
import { BreadCrumbs } from '../BreadCrumbs';
import { FloatingButton } from '../FloatingButton';
import { LotsList } from '../lots/LotsList';

export const Project = ({ history: { location: { pathname } } }) => {

    const { projectId } = useParams();

    usePushBreadcrumbs(types.projects, `Project: ${projectId}`, pathname);

    return (
        <>
            <BreadCrumbs nav={types.projects} />
            {/* <h1>
                Proyecto número {projectId}
            </h1> */}

            <div className="project">
                <div className="project__header">
                    <img src="/../assets/img/3.jpg" alt="" />
                    <div className="project__header__info">
                        <h1>Proyecto número {projectId}</h1>
                        <div className="project__header__info__aside">
                            <p>Lotes: <span>448</span></p>
                            <p>Vendidos: <span>64</span></p>
                            <p>Liquidados: <span>12</span></p>
                        </div>
                        {/* change for project name */}
                    </div>
                </div>
                <div className="project__body">
                    <h2>Información del Proyecto</h2>
                    <p className="project__body__available-lots item">
                        Lotes disponibles: <span>{384}</span>
                    </p>
                    <div className="project__body__svcs item">
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
                    <h2>Documentos</h2>
                    <div className="project__body__docs">
                        <div className="doc">Escrituras</div>
                        <div className="doc">Contrato de servicio de agua y drenaje</div>
                        <div className="doc">Contrato de servicio de electricidad</div>
                        <div className="doc">Planos</div>
                    </div>

                    <div className="project__body__form">
                        <div className="order">
                            <span>Ordenar por</span>
                            <select name="order" id="order">
                                <option value="higher">Mayor precio</option>
                                <option value="lower">Menor precio</option>
                                <option value="sold">Liquidados</option>
                                <option value="pending">Vendidos</option>
                            </select>
                        </div>
                        <div className="search">
                            <div className="item">
                                <span>Manzana</span>
                                <select name="manzana" id="manzana">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                            <div className="item">
                                <span>Lote</span>
                                <select name="lote" id="lote">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <LotsList projectId={projectId} />

                </div>
            </div>

            {/* /lote/:lotId */}


            
            {/* Change 2nd projectId for e.lotId */}

            <FloatingButton type='project' />

        </>
    )
}
