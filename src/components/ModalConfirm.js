import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { modalDisable } from '../actions/modal';
import { redirectSet } from '../actions/redirect';
import { clientSet } from '../actions/client';
import { redTypes } from '../types/reduxTypes'
import { getProjects } from '../actions/consults';

export const ModalConfirm = () => {

    const { active, beenClosed, title, text, link, okMsg, closeMsg, type } = useSelector(state => state.modal);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(modalDisable());
    }

    const handleOk = () => {
        if (type === redTypes.projectCreate) {
            dispatch(getProjects());
            dispatch(redirectSet(redTypes.projects, '/proyectos'));

        }
        if (type === redTypes.clientEdit) {
            dispatch(redirectSet(redTypes.clients, `/clientes`));
            dispatch(clientSet({}));
        }
        dispatch(modalDisable());
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
                    {
                        closeMsg && (
                            <p onClick={handleClose} className="modal__btns__link btn btn-err mr-2">
                                {closeMsg}
                            </p>
                        )
                    }
                    <Link to={link} onClick={handleOk} className="modal__btns__link btn btn-ok">
                        {okMsg}
                    </Link>
                </div>
            </div>
        </div>
    )
}
