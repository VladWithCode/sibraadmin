import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { types } from '../types';

export const ModalConfirm = () => {

    const { appData, appData: { modalActive, modalType }, setAppData } = useContext(AppContext);

    const [modalInfo, setModalInfo] = useState({
        title: '',
        text: '',
        link: '',
        okMsg: '',
        closeMsg: '',
        isClosed: false
    })

    useEffect(() => {
        if (modalType === types.projects) {
            setModalInfo({
                title: '¿Agregar nuevo proyecto?',
                text: '',
                link: '/',
                okMsg: 'Sí',
                closeMsg: 'No',
                beenClosed: false
            });
        }
    }, [modalType])

    const { title, text, link, okMsg, closeMsg, beenClosed } = modalInfo;

    const handleClose = () => {
        setAppData({ ...appData, modalActive: !modalActive })
        setModalInfo({...modalInfo, beenClosed: true})
    }

    return (
        <div onClick={handleClose} className={` ${!modalActive ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !modalActive ? 'modal-bc modal-animate-hide' : ''}`} >
            <div className="modal">
                <h3 className="modal__title">
                    {title}
                </h3>
                <div className="modal__text">
                    {text}
                </div>
                <div className="modal__btns">
                    <p onClick={handleClose} className="modal__btns__link btn-err">
                        {closeMsg}
                    </p>
                    <Link to={link} className="modal__btns__link btn-ok">
                        {okMsg}
                    </Link>
                </div>
            </div>
        </div>
    )

}
