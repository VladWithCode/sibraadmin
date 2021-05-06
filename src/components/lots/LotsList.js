import React from 'react';
import { NavLink } from 'react-router-dom';

export const LotsList = ({ projectId }) => {

    const lotId = 5;

    return (

        <div className="lot-list-container">
            <table className="lot-list">
            <tr className="headers">
                <th>Status</th>
                <th>Manzana</th>
                <th>Número de lote</th>
                <th>Área</th>
                <th>precio</th>
            </tr>
            <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                <td className="available">Disponible</td>
                <td>2</td>
                <td>14</td>
                <td>96m<sup>2</sup></td>
                <td>$65,000</td>
            </NavLink>
            <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                <td className="sold">Liquidado</td>
                <td>2</td>
                <td>14</td>
                <td>96m<sup>2</sup></td>
                <td>$65,000</td>
            </NavLink>
            <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                <td className="pending">Vendido</td>
                <td>2</td>
                <td>14</td>
                <td>96m<sup>2</sup></td>
                <td>$65,000</td>
            </NavLink>
            <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                <td className="available">Disponible</td>
                <td>2</td>
                <td>14</td>
                <td>96m<sup>2</sup></td>
                <td>$65,000</td>
            </NavLink>
            <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                <td className="sold">Liquidado</td>
                <td>2</td>
                <td>14</td>
                <td>96m<sup>2</sup></td>
                <td>$65,000</td>
            </NavLink>
            <NavLink className="item available" to={`./${projectId}/lote/${lotId}${projectId}`} >
                <td className="pending">Vendido</td>
                <td>2</td>
                <td>14</td>
                <td>96m<sup>2</sup></td>
                <td>$65,000</td>
            </NavLink>
           
        </table>
        </div>

    )
}
