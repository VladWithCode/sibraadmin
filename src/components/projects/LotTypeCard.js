import React from 'react'
import { useDispatch } from 'react-redux'
import { lotTypesModalConfirmEnable, lotTypesModalConfirmUpdate } from '../../actions/lotTypes';
import { redTypes } from '../../types/reduxTypes';

export const LotTypeCard = ({type, sameArea, pricePerM, cornerPrice, area}) => {

    const dispatch = useDispatch();

    const openEdit = (type) => {

        const modalInfo = {
            title: 'Editar tipo de lote',
            text: `Desea editar el tipo de lote: "${type.toUpperCase()}" ?`,
            okMsg: 'Editar',
            closeMsg: 'Cancelar',
            action: redTypes.edit,
            type
        }

        dispatch(lotTypesModalConfirmUpdate(modalInfo));
        dispatch(lotTypesModalConfirmEnable());
    }

    const openDelete = (type) => {
        const modalInfo = {
            title: 'Eliminar tipo de lote',
            text: `Desea eliminar el tipo de lote: "${type.toUpperCase()}" ?`,
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar',
            action: redTypes.delete,
            type
        }

        dispatch(lotTypesModalConfirmUpdate(modalInfo));
        dispatch(lotTypesModalConfirmEnable());
    }

    return (
        <div className="lot_types_list__item">
            <h3>Lotes tipo <strong>"{type?.toUpperCase()}"</strong> </h3>
            <div className="lot_types_list__item__content">
                <span>Misma area: <strong>{sameArea ? 'Sí' : 'No'}</strong> </span>
                {
                    sameArea && (
                        <span>Área: <strong>{area}m<sup>2</sup></strong></span>
                    )
                }
                <span>Precio por m<sup>2</sup>: <strong>${pricePerM}</strong></span>
                <span>Precio por m<sup>2</sup> en esquinas: <strong>${cornerPrice}</strong></span>
            </div>
            <div className="lot_types_list__item__btns">
                <span onClick={() => openEdit(type)} className="edit">
                    Editar
                </span>
                <span onClick={() => openDelete(type)} className="delete">
                    Eliminar
                </span>
            </div>
        </div>
    )
}
