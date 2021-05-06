import React from 'react';
import { useParams } from 'react-router-dom';
import { usePushBreadcrumbs } from '../../hooks/usePushBreadcrumbs';
import { types } from '../../types';
import { BreadCrumbs } from '../BreadCrumbs';
import { FloatingButton } from '../FloatingButton';

export const Lot = ({ history: { location: { pathname } } }) => {

    const { lotId } = useParams();

    usePushBreadcrumbs(types.projects, `Lot: ${lotId}`, pathname);


    return (
        <>
            <BreadCrumbs nav={types.projects} />

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
                    </div>
                    <div className="lot__body__resume">
                        <p className="status available">Disponible</p>
                        <div className="stats item">
                            <p>Área: <span>96m<sup>2</sup></span></p>
                            <p className="price">Precio: <span>$140,000.00</span></p>
                        </div>
                    </div>

                </div>
            </div>

            <FloatingButton type='lotAvailable' />
            {/* <FloatingButtonSecondary type='lotAvailable' /> */}
        </>
    )
}