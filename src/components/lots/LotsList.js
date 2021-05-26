import React from 'react';
import { NavLink } from 'react-router-dom';

export const LotsList = ({ projectId }) => {

    const lotId = 5;

    return (

        <div className="lot-list-container">
            <div className="lot-list">
                <div className="headers">
                    <span>Status</span>
                    <span>Manzana</span>
                    <span>Número de lote</span>
                    <span>Área</span>
                    <span>precio</span>
                </div>
                <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                    <span className="available">Disponible</span>
                    <span>2</span>
                    <span>14</span>
                    <span>96m<sup>2</sup></span>
                    <span>$65,000</span>
                </NavLink>
                <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                    <span className="sold">Liquidado</span>
                    <span>2</span>
                    <span>14</span>
                    <span>96m<sup>2</sup></span>
                    <span>$65,000</span>
                </NavLink>
                <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                    <span className="pending">Vendido</span>
                    <span>2</span>
                    <span>14</span>
                    <span>96m<sup>2</sup></span>
                    <span>$65,000</span>
                </NavLink>
                <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                    <span className="available">Disponible</span>
                    <span>2</span>
                    <span>14</span>
                    <span>96m<sup>2</sup></span>
                    <span>$65,000</span>
                </NavLink>
                <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                    <span className="sold">Liquidado</span>
                    <span>2</span>
                    <span>14</span>
                    <span>96m<sup>2</sup></span>
                    <span>$65,000</span>
                </NavLink>
                <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                    <span className="pending">Vendido</span>
                    <span>2</span>
                    <span>14</span>
                    <span>96m<sup>2</sup></span>
                    <span>$65,000</span>
                </NavLink>

            </div>
        </div>

    )
}
