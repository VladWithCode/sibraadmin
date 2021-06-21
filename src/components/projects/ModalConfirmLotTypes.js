import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { lotTypesDelete, lotTypesModalConfirmDisable, lotTypesModalEnable } from '../../actions/lotTypes';
import { redTypes } from '../../types/reduxTypes';

export const ModalConfirmLotTypes = () => {

    const dispatch = useDispatch();

    const {beenClosed, active, title, text, okMsg, closeMsg, action, type} = useSelector(state => state.types.modalConfirm);

    const handleClose = () => {
        dispatch(lotTypesModalConfirmDisable());
    }

    const handleEdit = () => {
        dispatch(lotTypesModalEnable())
        dispatch(lotTypesModalConfirmDisable());
    }

    const hanldeDelete = () => {
        dispatch(lotTypesDelete(type));
        dispatch(lotTypesModalConfirmDisable());
    }

    return (
        <div className={` ${!active ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !active ? 'modal-bc modal-animate-hide' : ''}`} >
            <div className="modal">
                <h3 className="modal__title">
                    {title}
                </h3>

                <div className="modal__text">
                    {text}
                </div>

                <div className="modal__btns">
                    <p onClick={handleClose} className={`modal__btns__link btn ${action === redTypes.delete ? 'btn-ok' : 'btn-err'}`}>
                        {closeMsg}
                    </p>
                    <p onClick={action === redTypes.delete ? hanldeDelete : handleEdit} className={`modal__btns__link btn ${action === redTypes.edit ? 'btn-ok' : 'btn-err ml-2'}`}>
                        {okMsg}
                    </p>
                </div>
            </div>
        </div>
    )
}
