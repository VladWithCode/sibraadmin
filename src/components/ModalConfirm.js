import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { modalDisable } from '../actions/modal';

export const ModalConfirm = () => {

    const { active, beenClosed, title, text, link, okMsg, closeMsg, input, input2 } = useSelector(state => state.modal);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(modalDisable());
    }

    return (
        <div onClick={handleClose} className={` ${!active ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !active ? 'modal-bc modal-animate-hide' : ''}`} >
            <div className="modal">
                <h3 className="modal__title">
                    {title}
                </h3>
                <div className="modal__text">
                    {text}
                </div>
                {
                    input && (
                        <div className="modal__input">
                            <input type="text" placeholder="Input 1" />
                            {
                                input2 && (
                                    <input type="text" placeholder="Input 2" />
                                )
                            }
                        </div>
                    )
                }
                <div className="modal__btns">
                    <p onClick={handleClose} className="modal__btns__link btn btn-err">
                        {closeMsg}
                    </p>
                    <Link to={link} className="modal__btns__link btn btn-ok">
                        {okMsg}
                    </Link>
                </div>
            </div>
        </div>
    )
}
