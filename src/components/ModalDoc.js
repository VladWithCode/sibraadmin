import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteFile, deleteClient } from '../actions/consults';
import { redTypes } from '../types/reduxTypes'

import { projectDisableSvcModal } from '../actions/project';

export const ModalDoc = React.memo(({ fileName, type, id, projectId }) => {


    const dispatch = useDispatch();

    const { modalServices: { active, beenClosed, title, text, okMsg, closeMsg, refId } } = useSelector(state => state.project);

    const handleClose = () => {
        dispatch(projectDisableSvcModal());
    }

    const handleDeleteFile = (e) => {
        e?.preventDefault();

        if (type === redTypes.clientDelete) {
            dispatch(deleteClient(id, fileName, projectId))

        } else {
            dispatch(deleteFile(fileName, type, id, refId, projectId));
        }

        dispatch(projectDisableSvcModal());

    }


    return (
        <>
            {
                <div className={` ${!active ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !active ? 'modal-bc modal-animate-hide' : ''}`} >
                    <div className="modal">
                        <h3 className="modal__title">
                            {title}
                        </h3>

                        <p className="modal__text">
                            {text}
                        </p>

                        <div className="modal__btns">
                            <p onClick={handleClose} className="modal__btns__link btn btn-err mr-2">
                                {closeMsg}
                            </p>

                            <p
                                onClick={handleDeleteFile}
                                className="modal__btns__link btn btn-ok">
                                {okMsg}
                            </p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
})